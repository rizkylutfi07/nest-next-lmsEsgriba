import { IsString, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusUjian } from '@prisma/client';

export class FilterUjianDto {
    @IsString()
    @IsOptional()
    search?: string;

    @IsString()
    @IsOptional()
    mataPelajaranId?: string;

    @IsString()
    @IsOptional()
    kelasId?: string;

    @IsString()
    @IsOptional()
    guruId?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    @IsOptional()
    page?: number = 1;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    @IsOptional()
    limit?: number = 10;
}

