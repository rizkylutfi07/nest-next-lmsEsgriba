import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusTahunAjaran } from './create-tahun-ajaran.dto';

export class QueryTahunAjaranDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    limit?: number = 10;

    @IsString()
    @IsOptional()
    search?: string;

    @IsEnum(StatusTahunAjaran)
    @IsOptional()
    status?: StatusTahunAjaran;
}
