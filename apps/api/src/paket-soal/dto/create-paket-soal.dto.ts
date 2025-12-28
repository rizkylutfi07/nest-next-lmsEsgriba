import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreatePaketSoalDto {
    @IsString()
    @IsNotEmpty()
    kode: string;

    @IsString()
    @IsNotEmpty()
    nama: string;

    @IsString()
    @IsOptional()
    deskripsi?: string;

    @IsString()
    @IsOptional()
    mataPelajaranId?: string;

    @IsString()
    @IsOptional()
    guruId?: string;

    @IsArray()
    @IsOptional()
    kelasIds?: string[];
}

