import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

// School settings keys
const SCHOOL_SETTINGS_KEYS = [
    'school_name',
    'school_address',
    'school_phone',
    'school_email',
    'school_website',
    'school_principal_name',
    'school_principal_nip',
    'school_logo',
    'school_instagram',
    'school_facebook',
    'school_youtube',
];
@Injectable()
export class SettingsService {
    constructor(private readonly prisma: PrismaService) { }

    async getSetting(key: string) {
        const setting = await this.prisma.settings.findUnique({
            where: { key },
        });
        return setting;
    }

    async getAllSettings() {
        const settings = await this.prisma.settings.findMany();
        return settings;
    }

    async updateSetting(dto: UpdateSettingsDto) {
        const setting = await this.prisma.settings.upsert({
            where: { key: dto.key },
            update: { value: dto.value },
            create: { key: dto.key, value: dto.value },
        });
        return setting;
    }

    async getLateTimeThreshold(): Promise<string> {
        const setting = await this.getSetting('late_time_threshold');
        return setting?.value || '07:30'; // Default 07:30
    }

    // School Settings Methods
    async getSchoolSettings(): Promise<Record<string, string>> {
        const settings = await this.prisma.settings.findMany({
            where: { key: { in: SCHOOL_SETTINGS_KEYS } },
        });

        const result: Record<string, string> = {};
        SCHOOL_SETTINGS_KEYS.forEach(key => {
            const setting = settings.find(s => s.key === key);
            result[key] = setting?.value || '';
        });
        return result;
    }

    async updateSchoolSettings(data: Record<string, string>): Promise<Record<string, string>> {
        const updates = Object.entries(data)
            .filter(([key]) => SCHOOL_SETTINGS_KEYS.includes(key))
            .map(([key, value]) =>
                this.prisma.settings.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value },
                })
            );

        await Promise.all(updates);
        return this.getSchoolSettings();
    }
}
