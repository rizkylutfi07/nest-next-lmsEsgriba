import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { StatusTahunAjaran } from './create-tahun-ajaran.dto';

export class UpdateTahunAjaranDto {
    @IsString()
    @IsOptional()
    tahun?: string;

    @IsDateString()
    @IsOptional()
    tanggalMulai?: string;

    @IsDateString()
    @IsOptional()
    tanggalSelesai?: string;

    @IsEnum(StatusTahunAjaran)
    @IsOptional()
    status?: StatusTahunAjaran;
}
