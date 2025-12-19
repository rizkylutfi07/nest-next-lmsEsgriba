import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { UjianSiswaService } from './ujian-siswa.service';
import { StartUjianDto } from './dto/start-ujian.dto';
import { SubmitJawabanDto } from './dto/submit-jawaban.dto';
import { LogActivityDto } from './dto/log-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('ujian-siswa')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UjianSiswaController {
    constructor(private readonly ujianSiswaService: UjianSiswaService) { }

    @Get('available')
    @Roles(Role.SISWA)
    getAvailableExams(@Request() req) {
        // Get siswaId from user
        return this.ujianSiswaService.getAvailableExams(req.user.siswaId);
    }

    @Post('start')
    @Roles(Role.SISWA)
    startExam(@Body() startUjianDto: StartUjianDto, @Request() req) {
        return this.ujianSiswaService.startExam(startUjianDto, req.user.siswaId);
    }

    @Get('session/:id')
    @Roles(Role.SISWA)
    getExamSession(@Param('id') id: string, @Request() req) {
        return this.ujianSiswaService.getExamSession(id, req.user.siswaId);
    }

    @Post('submit/:id')
    @Roles(Role.SISWA)
    submitAnswer(
        @Param('id') id: string,
        @Body() submitDto: SubmitJawabanDto,
        @Request() req,
    ) {
        return this.ujianSiswaService.submitAnswer(id, submitDto, req.user.siswaId);
    }

    @Post('progress/:id')
    @Roles(Role.SISWA)
    saveProgress(
        @Param('id') id: string,
        @Body() submitDto: SubmitJawabanDto,
        @Request() req,
    ) {
        return this.ujianSiswaService.saveProgress(id, submitDto, req.user.siswaId);
    }

    @Post('log-activity')
    @Roles(Role.SISWA)
    logActivity(@Body() logDto: LogActivityDto, @Request() req) {
        return this.ujianSiswaService.logActivity(logDto, req.user.siswaId);
    }

    @Get('result/:id')
    @Roles(Role.SISWA)
    getResult(@Param('id') id: string, @Request() req) {
        return this.ujianSiswaService.getResult(id, req.user.siswaId);
    }

    @Get('activity-logs/:id')
    @Roles(Role.ADMIN, Role.GURU)
    getActivityLogs(@Param('id') id: string) {
        return this.ujianSiswaService.getActivityLogs(id);
    }

    @Post(':id/block')
    @Roles(Role.ADMIN, Role.GURU)
    blockStudent(@Param('id') id: string) {
        return this.ujianSiswaService.blockStudent(id);
    }

    @Post(':id/unblock')
    @Roles(Role.ADMIN, Role.GURU)
    unblockStudent(@Param('id') id: string) {
        return this.ujianSiswaService.unblockStudent(id);
    }

    @Get('monitoring/:ujianId')
    @Roles(Role.ADMIN, Role.GURU)
    getMonitoringData(@Param('ujianId') ujianId: string) {
        return this.ujianSiswaService.getMonitoringData(ujianId);
    }
}
