import { IsString, IsEnum, IsOptional, IsInt, Min, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';
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

    @IsArray()
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.split(',');
        }
        return value;
    })
    mataPelajaranIds?: string[];

    @IsString()
    @IsOptional()
    guruId?: string;

    @IsString()
    @IsOptional()
    kelasId?: string;

    @IsArray()
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.split(',');
        }
        return value;
    })
    kelasIds?: string[];

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
