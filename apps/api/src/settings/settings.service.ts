import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

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
}
