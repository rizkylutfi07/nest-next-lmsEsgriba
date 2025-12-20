import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Hari } from '@prisma/client';

export class CreateJadwalPelajaranDto {
    @IsEnum(Hari)
    @IsNotEmpty()
    hari: Hari;

    @IsString()
    @IsNotEmpty()
    jamMulai: string;

    @IsString()
    @IsNotEmpty()
    jamSelesai: string;

    @IsString()
    @IsNotEmpty()
    kelasId: string;

    @IsString()
    @IsNotEmpty()
    mataPelajaranId: string;

    @IsString()
    @IsNotEmpty()
    guruId: string;
}
