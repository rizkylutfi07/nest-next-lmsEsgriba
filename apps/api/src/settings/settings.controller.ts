import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    @Roles(Role.ADMIN)
    getAllSettings() {
        return this.settingsService.getAllSettings();
    }

    @Get('school')
    @Roles(Role.ADMIN, Role.GURU, Role.SISWA, Role.PETUGAS_ABSENSI)
    getSchoolSettings() {
        return this.settingsService.getSchoolSettings();
    }

    @Get(':key')
    @Roles(Role.ADMIN, Role.GURU, Role.PETUGAS_ABSENSI)
    getSetting(@Param('key') key: string) {
        return this.settingsService.getSetting(key);
    }

    @Put()
    @Roles(Role.ADMIN)
    updateSetting(@Body() dto: UpdateSettingsDto) {
        return this.settingsService.updateSetting(dto);
    }

    @Put('school')
    @Roles(Role.ADMIN)
    updateSchoolSettings(@Body() data: Record<string, string>) {
        return this.settingsService.updateSchoolSettings(data);
    }
}
