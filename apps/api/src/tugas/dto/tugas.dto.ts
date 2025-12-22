import { IsString, IsOptional, IsBoolean, IsEnum, IsInt, IsDateString, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TipePenilaian } from '@prisma/client';

export class CreateTugasDto {
    @IsString()
    judul: string;

    @IsString()
    deskripsi: string;

    @IsOptional()
    @IsString()
    instruksi?: string;

    @IsString()
    mataPelajaranId: string;

    @IsOptional()
    @IsString()
    kelasId?: string;

    @IsDateString()
    deadline: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(1000)
    @Type(() => Number)
    @Transform(({ value }) => parseInt(value))
    maxScore?: number;

    @IsOptional()
    @IsEnum(TipePenilaian)
    tipePenilaian?: TipePenilaian;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    allowLateSubmit?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isPublished?: boolean;

    @IsOptional()
    @IsString()
    guruId?: string; // For ADMIN to specify which guru creates the assignment
}

export class UpdateTugasDto {
    @IsOptional()
    @IsString()
    judul?: string;

    @IsOptional()
    @IsString()
    deskripsi?: string;

    @IsOptional()
    @IsString()
    instruksi?: string;

    @IsOptional()
    @IsString()
    mataPelajaranId?: string;

    @IsOptional()
    @IsString()
    kelasId?: string;

    @IsOptional()
    @IsDateString()
    deadline?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(1000)
    @Type(() => Number)
    maxScore?: number;

    @IsOptional()
    @IsEnum(TipePenilaian)
    tipePenilaian?: TipePenilaian;

    @IsOptional()
    @IsBoolean()
    allowLateSubmit?: boolean;

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;
}

export class SubmitTugasDto {
    @IsOptional()
    @IsString()
    konten?: string;
}

export class GradeTugasDto {
    @IsInt()
    @Min(0)
    @Type(() => Number)
    score: number;

    @IsOptional()
    @IsString()
    feedback?: string;
}
