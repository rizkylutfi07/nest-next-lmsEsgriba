import { Injectable, BadRequestException } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class DatabaseService {
    private readonly backupDir = path.join(process.cwd(), 'apps/api/backups');
    private readonly dockerContainer = 'belajar-postgres'; // PostgreSQL Docker container name

    constructor() {
        // Ensure backup directory exists
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    async exportDatabase(): Promise<Buffer> {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
            const filename = `backup_${timestamp}_${Date.now()}.sql`;
            const filepath = path.join(this.backupDir, filename);

            // Get database connection info from environment
            const dbUrl = process.env.DATABASE_URL;
            if (!dbUrl) {
                throw new BadRequestException('DATABASE_URL not configured');
            }

            // Parse database URL
            const url = new URL(dbUrl);
            const dbName = url.pathname.slice(1);
            const dbUser = url.username;
            const dbPassword = url.password;

            // Execute pg_dump inside Docker container
            const command = `docker exec ${this.dockerContainer} pg_dump -U ${dbUser} -d ${dbName} > "${filepath}"`;

            await execAsync(command, {
                env: { ...process.env, PGPASSWORD: dbPassword }
            });

            // Read the file and return as buffer
            const buffer = fs.readFileSync(filepath);

            return buffer;
        } catch (error) {
            console.error('Export database error:', error);
            throw new BadRequestException(`Failed to export database: ${error.message}`);
        }
    }

    async createAutoBackup(): Promise<string> {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `auto_backup_${timestamp}.sql`;
            const filepath = path.join(this.backupDir, filename);

            const dbUrl = process.env.DATABASE_URL;
            if (!dbUrl) {
                throw new BadRequestException('DATABASE_URL not configured');
            }

            const url = new URL(dbUrl);
            const dbName = url.pathname.slice(1);
            const dbUser = url.username;
            const dbPassword = url.password;

            // Execute pg_dump inside Docker container
            const command = `docker exec ${this.dockerContainer} pg_dump -U ${dbUser} -d ${dbName} > "${filepath}"`;

            await execAsync(command, {
                env: { ...process.env, PGPASSWORD: dbPassword }
            });

            return filename;
        } catch (error) {
            console.error('Auto backup error:', error);
            throw new BadRequestException(`Failed to create auto backup: ${error.message}`);
        }
    }

    async importDatabase(sqlContent: string, createBackup: boolean = true): Promise<{ message: string; backupFile?: string; warning?: string }> {
        try {
            let backupFile: string | undefined;
            let warning: string | undefined;

            // Create automatic backup if requested
            if (createBackup) {
                try {
                    backupFile = await this.createAutoBackup();
                } catch (error) {
                    console.warn('Backup creation failed, continuing without backup:', error.message);
                    warning = 'Backup creation skipped. Import will proceed WITHOUT backup!';
                }
            }

            // Write SQL content to temp file
            const tempFile = path.join(this.backupDir, `temp_import_${Date.now()}.sql`);
            fs.writeFileSync(tempFile, sqlContent);

            const dbUrl = process.env.DATABASE_URL;
            if (!dbUrl) {
                throw new BadRequestException('DATABASE_URL not configured');
            }

            const url = new URL(dbUrl);
            const dbName = url.pathname.slice(1);
            const dbUser = url.username;
            const dbPassword = url.password;

            // Copy SQL file to Docker container
            const containerTempFile = `/tmp/import_${Date.now()}.sql`;
            await execAsync(`docker cp "${tempFile}" ${this.dockerContainer}:${containerTempFile}`);

            // First, drop all tables to ensure clean import
            // This ensures old data is removed before importing
            const dropTablesCommand = `docker exec ${this.dockerContainer} psql -U ${dbUser} -d ${dbName} -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO ${dbUser}; GRANT ALL ON SCHEMA public TO public;"`;

            try {
                await execAsync(dropTablesCommand, {
                    env: { ...process.env, PGPASSWORD: dbPassword }
                });
            } catch (error) {
                console.warn('Drop schema warning:', error.message);
            }

            // Execute psql inside Docker container to import
            const command = `docker exec ${this.dockerContainer} psql -U ${dbUser} -d ${dbName} -f ${containerTempFile}`;

            await execAsync(command, {
                env: { ...process.env, PGPASSWORD: dbPassword }
            });

            // Clean up temp files
            fs.unlinkSync(tempFile);
            await execAsync(`docker exec ${this.dockerContainer} rm ${containerTempFile}`);

            return {
                message: 'Database imported successfully',
                backupFile,
                warning,
            };
        } catch (error) {
            console.error('Import database error:', error);
            throw new BadRequestException(`Failed to import database: ${error.message}`);
        }
    }

    async listBackups(): Promise<Array<{ filename: string; size: number; created: Date }>> {
        try {
            const files = fs.readdirSync(this.backupDir);

            const backups = files
                .filter(file => file.endsWith('.sql'))
                .map(file => {
                    const filepath = path.join(this.backupDir, file);
                    const stats = fs.statSync(filepath);
                    return {
                        filename: file,
                        size: stats.size,
                        created: stats.birthtime,
                    };
                })
                .sort((a, b) => b.created.getTime() - a.created.getTime());

            return backups;
        } catch (error) {
            console.error('List backups error:', error);
            throw new BadRequestException(`Failed to list backups: ${error.message}`);
        }
    }

    async getBackupFile(filename: string): Promise<Buffer> {
        try {
            const filepath = path.join(this.backupDir, filename);

            // Security check: ensure filename doesn't contain path traversal
            if (filename.includes('..') || filename.includes('/')) {
                throw new BadRequestException('Invalid filename');
            }

            if (!fs.existsSync(filepath)) {
                throw new BadRequestException('Backup file not found');
            }

            return fs.readFileSync(filepath);
        } catch (error) {
            console.error('Get backup file error:', error);
            throw new BadRequestException(`Failed to get backup file: ${error.message}`);
        }
    }

    async deleteBackup(filename: string): Promise<{ message: string }> {
        try {
            const filepath = path.join(this.backupDir, filename);

            // Security check
            if (filename.includes('..') || filename.includes('/')) {
                throw new BadRequestException('Invalid filename');
            }

            if (!fs.existsSync(filepath)) {
                throw new BadRequestException('Backup file not found');
            }

            fs.unlinkSync(filepath);

            return { message: 'Backup deleted successfully' };
        } catch (error) {
            console.error('Delete backup error:', error);
            throw new BadRequestException(`Failed to delete backup: ${error.message}`);
        }
    }
}
