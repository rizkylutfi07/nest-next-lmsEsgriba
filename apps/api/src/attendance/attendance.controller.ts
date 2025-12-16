import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ScanBarcodeDto, CheckInDto, CheckOutDto, AttendanceQueryDto, UpdateAttendanceDto, ManualAttendanceDto, ManualAttendanceQueryDto } from './dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('scan')
    @Roles(Role.ADMIN, Role.GURU, Role.PETUGAS_ABSENSI)
    scanBarcode(@Body() dto: ScanBarcodeDto, @Request() req) {
        return this.attendanceService.scanBarcode(dto, req.user.sub);
    }

    @Post('check-in')
    @Roles(Role.ADMIN, Role.GURU, Role.PETUGAS_ABSENSI)
    checkIn(@Body() dto: CheckInDto, @Request() req) {
        return this.attendanceService.checkIn(dto, req.user.sub);
    }

    @Post('check-out')
    @Roles(Role.ADMIN, Role.GURU, Role.PETUGAS_ABSENSI)
    checkOut(@Body() dto: CheckOutDto) {
        return this.attendanceService.checkOut(dto);
    }

    @Get('today')
    @Roles(Role.ADMIN, Role.GURU, Role.PETUGAS_ABSENSI)
    getTodayAttendance() {
        return this.attendanceService.getTodayAttendance();
    }

    @Get('absent-students')
    @Roles(Role.ADMIN, Role.GURU, Role.PETUGAS_ABSENSI)
    getAbsentStudents() {
        return this.attendanceService.getAbsentStudents();
    }

    @Get('date/:date')
    @Roles(Role.ADMIN, Role.GURU, Role.PETUGAS_ABSENSI)
    getAttendanceByDate(@Param('date') date: string) {
        return this.attendanceService.getAttendanceByDate(date);
    }

    @Get('student/:id')
    getStudentAttendance(
        @Param('id') id: string,
        @Query() query: AttendanceQueryDto,
    ) {
        return this.attendanceService.getStudentAttendance(id, query);
    }

    @Get('report')
    @Roles(Role.ADMIN, Role.GURU, Role.PETUGAS_ABSENSI)
    generateAttendanceReport(@Query() query: AttendanceQueryDto) {
        return this.attendanceService.generateAttendanceReport(query);
    }

    // Manual Attendance Endpoints
    @Get('manual')
    @Roles(Role.ADMIN, Role.GURU, Role.PETUGAS_ABSENSI)
    getStudentsForManualAttendance(@Query() query: ManualAttendanceQueryDto) {
        return this.attendanceService.getStudentsForManualAttendance(query);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.GURU, Role.PETUGAS_ABSENSI)
    updateAttendanceStatus(
        @Param('id') id: string,
        @Body() dto: UpdateAttendanceDto,
        @Request() req,
    ) {
        return this.attendanceService.updateAttendanceStatus(id, dto, req.user.sub);
    }

    @Post('manual')
    @Roles(Role.ADMIN, Role.GURU, Role.PETUGAS_ABSENSI)
    createManualAttendance(@Body() dto: ManualAttendanceDto, @Request() req) {
        return this.attendanceService.createManualAttendance(dto, req.user.sub);
    }
}
