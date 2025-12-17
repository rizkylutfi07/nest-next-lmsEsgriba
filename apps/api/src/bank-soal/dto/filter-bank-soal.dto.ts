import { IsString, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TipeSoal } from '@prisma/client';

export class FilterBankSoalDto {
    @IsString()
    @IsOptional()
    search?: string;

    @IsEnum(TipeSoal)
    @IsOptional()
    tipe?: TipeSoal;

    @IsString()
    @IsOptional()
    mataPelajaranId?: string;

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
