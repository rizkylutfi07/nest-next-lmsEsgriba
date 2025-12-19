import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
    private readonly uploadDir = path.join(process.cwd(), 'uploads', 'soal');

    constructor() {
        // Ensure upload directory exists
        this.ensureDirectoryExists();
    }

    private ensureDirectoryExists(): void {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    /**
     * Save an image buffer to disk
     * @param buffer - Image buffer
     * @param originalFilename - Original filename (for extension)
     * @param contentType - MIME type of the image
     * @returns The URL path to access the image
     */
    async saveImage(buffer: Buffer, originalFilename?: string, contentType?: string): Promise<string> {
        this.ensureDirectoryExists();

        // Determine file extension
        let extension = '.png';
        if (contentType) {
            if (contentType.includes('jpeg') || contentType.includes('jpg')) {
                extension = '.jpg';
            } else if (contentType.includes('gif')) {
                extension = '.gif';
            } else if (contentType.includes('webp')) {
                extension = '.webp';
            } else if (contentType.includes('svg')) {
                extension = '.svg';
            }
        } else if (originalFilename) {
            const ext = path.extname(originalFilename).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
                extension = ext;
            }
        }

        // Generate unique filename
        const filename = `${uuidv4()}${extension}`;
        const filepath = path.join(this.uploadDir, filename);

        // Write file to disk
        await fs.promises.writeFile(filepath, buffer);

        // Return the URL path (relative to static serving)
        return `/uploads/soal/${filename}`;
    }

    /**
     * Save base64 encoded image
     * @param base64Data - Base64 encoded image data (with or without data URL prefix)
     * @param contentType - MIME type if known
     * @returns The URL path to access the image
     */
    async saveBase64Image(base64Data: string, contentType?: string): Promise<string> {
        // Remove data URL prefix if present
        let cleanBase64 = base64Data;
        let detectedContentType = contentType;

        if (base64Data.startsWith('data:')) {
            const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
            if (matches) {
                detectedContentType = matches[1];
                cleanBase64 = matches[2];
            }
        }

        const buffer = Buffer.from(cleanBase64, 'base64');
        return this.saveImage(buffer, undefined, detectedContentType);
    }

    /**
     * Delete an image by its URL path
     * @param urlPath - The URL path returned by saveImage
     */
    async deleteImage(urlPath: string): Promise<void> {
        const filename = path.basename(urlPath);
        const filepath = path.join(this.uploadDir, filename);

        if (fs.existsSync(filepath)) {
            await fs.promises.unlink(filepath);
        }
    }

    /**
     * Get the full file path for an image URL
     * @param urlPath - The URL path
     * @returns The full filesystem path
     */
    getFilePath(urlPath: string): string {
        const filename = path.basename(urlPath);
        return path.join(this.uploadDir, filename);
    }
}
