import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('dashboard')
    @Roles(Role.SISWA)
    getDashboard(@Req() req: any) {
        const siswaId = req.user.siswa?.id;
        return this.analyticsService.getStudentDashboard(siswaId);
    }

    @Get('upcoming-tasks')
    @Roles(Role.SISWA)
    getUpcomingTasks(@Req() req: any) {
        const siswaId = req.user.siswa?.id;
        return this.analyticsService.getUpcomingTasks(siswaId);
    }
}
