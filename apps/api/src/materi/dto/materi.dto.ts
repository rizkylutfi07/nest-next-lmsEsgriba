import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { TipeMateri } from '@prisma/client';

export class CreateMateriDto {
    @IsString()
    judul: string;

    @IsOptional()
    @IsString()
    deskripsi?: string;

    @IsEnum(TipeMateri)
    tipe: TipeMateri;

    @IsOptional()
    @IsString()
    konten?: string;

    @IsString()
    mataPelajaranId: string;

    @IsOptional()
    @IsString()
    kelasId?: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isPinned?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isPublished?: boolean;

    @IsOptional()
    @IsString()
    guruId?: string; // For ADMIN to specify which guru creates the material
}

export class UpdateMateriDto {
    @IsOptional()
    @IsString()
    judul?: string;

    @IsOptional()
    @IsString()
    deskripsi?: string;

    @IsOptional()
    @IsEnum(TipeMateri)
    tipe?: TipeMateri;

    @IsOptional()
    @IsString()
    konten?: string;

    @IsOptional()
    @IsString()
    mataPelajaranId?: string;

    @IsOptional()
    @IsString()
    kelasId?: string;

    @IsOptional()
    @IsBoolean()
    isPinned?: boolean;

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;
}
