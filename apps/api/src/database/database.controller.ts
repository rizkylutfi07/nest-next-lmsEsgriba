import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Res,
    Query,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { DatabaseService } from './database.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('database')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class DatabaseController {
    constructor(private readonly databaseService: DatabaseService) { }

    @Get('export')
    async exportDatabase(@Res() res: Response) {
        const buffer = await this.databaseService.exportDatabase();

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const filename = `database_backup_${timestamp}.sql`;

        res.setHeader('Content-Type', 'application/sql');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(buffer);
    }

    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    async importDatabase(
        @UploadedFile() file: Express.Multer.File,
        @Query('createBackup') createBackup?: string,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // Validate file type
        if (!file.originalname.endsWith('.sql')) {
            throw new BadRequestException('Only .sql files are allowed');
        }

        // Validate file size (max 100MB)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            throw new BadRequestException('File size exceeds 100MB limit');
        }

        const sqlContent = file.buffer.toString('utf-8');
        const shouldCreateBackup = createBackup !== 'false';

        return this.databaseService.importDatabase(sqlContent, shouldCreateBackup);
    }

    @Get('backups')
    async listBackups() {
        return this.databaseService.listBackups();
    }

    @Get('backups/:filename')
    async downloadBackup(@Param('filename') filename: string, @Res() res: Response) {
        const buffer = await this.databaseService.getBackupFile(filename);

        res.setHeader('Content-Type', 'application/sql');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(buffer);
    }

    @Delete('backups/:filename')
    async deleteBackup(@Param('filename') filename: string) {
        return this.databaseService.deleteBackup(filename);
    }
}
