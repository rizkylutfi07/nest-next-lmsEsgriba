import { IsString, IsInt, IsArray, IsNotEmpty, Min } from 'class-validator';

export class GenerateRppDto {
    @IsString()
    @IsNotEmpty()
    mataPelajaran: string;

    @IsString()
    @IsNotEmpty()
    materi: string;

    @IsString()
    @IsNotEmpty()
    fase: string;

    @IsInt()
    @Min(30)
    alokasiWaktu: number;

    @IsArray()
    @IsNotEmpty()
    dimensiProfilLulusan: string[];
}
