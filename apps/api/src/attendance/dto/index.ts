import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class ScanBarcodeDto {
    @IsString()
    @IsNotEmpty()
    nisn: string;

    @IsOptional()
    @IsString()
    keterangan?: string;
}

export class CheckInDto {
    @IsString()
    @IsNotEmpty()
    siswaId: string;

    @IsOptional()
    @IsEnum(AttendanceStatus)
    status?: AttendanceStatus;

    @IsOptional()
    @IsString()
    keterangan?: string;
}

export class CheckOutDto {
    @IsString()
    @IsNotEmpty()
    siswaId: string;
}

export class AttendanceQueryDto {
    @IsOptional()
    @IsString()
    startDate?: string;

    @IsOptional()
    @IsString()
    endDate?: string;

    @IsOptional()
    @IsString()
    kelasId?: string;

    @IsOptional()
    @IsEnum(AttendanceStatus)
    status?: AttendanceStatus;
}
