import {
    Controller,
    Get,
    Post,
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
import { ScanBarcodeDto, CheckInDto, CheckOutDto, AttendanceQueryDto } from './dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('scan')
    @Roles(Role.ADMIN, Role.GURU)
    scanBarcode(@Body() dto: ScanBarcodeDto, @Request() req) {
        return this.attendanceService.scanBarcode(dto, req.user.sub);
    }

    @Post('check-in')
    @Roles(Role.ADMIN, Role.GURU)
    checkIn(@Body() dto: CheckInDto, @Request() req) {
        return this.attendanceService.checkIn(dto, req.user.sub);
    }

    @Post('check-out')
    @Roles(Role.ADMIN, Role.GURU)
    checkOut(@Body() dto: CheckOutDto) {
        return this.attendanceService.checkOut(dto);
    }

    @Get('today')
    @Roles(Role.ADMIN, Role.GURU)
    getTodayAttendance() {
        return this.attendanceService.getTodayAttendance();
    }

    @Get('date/:date')
    @Roles(Role.ADMIN, Role.GURU)
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
    @Roles(Role.ADMIN, Role.GURU)
    generateAttendanceReport(@Query() query: AttendanceQueryDto) {
        return this.attendanceService.generateAttendanceReport(query);
    }
}
