import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';

export enum StatusTahunAjaran {
    AKTIF = 'AKTIF',
    SELESAI = 'SELESAI',
    AKAN_DATANG = 'AKAN_DATANG',
}

export class CreateTahunAjaranDto {
    @IsString()
    @IsNotEmpty()
    tahun: string; // e.g., "2024/2025"

    @IsDateString()
    tanggalMulai: string;

    @IsDateString()
    tanggalSelesai: string;

    @IsEnum(StatusTahunAjaran)
    status: StatusTahunAjaran;
}
