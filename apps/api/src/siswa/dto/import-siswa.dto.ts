import { IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { StatusSiswa } from '@prisma/client';

export class ImportSiswaRowDto {
    @IsString()
    @IsNotEmpty()
    nisn: string;

    @IsString()
    @IsNotEmpty()
    nama: string;

    @IsDateString()
    @IsNotEmpty()
    tanggalLahir: string;

    @IsString()
    @IsOptional()
    alamat?: string;

    @IsString()
    @IsOptional()
    nomorTelepon?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsEnum(StatusSiswa)
    @IsNotEmpty()
    status: StatusSiswa;

    @IsString()
    @IsOptional()
    kelasNama?: string; // Will be resolved to kelasId

    @IsBoolean()
    @IsOptional()
    createUserAccount?: boolean;
}
