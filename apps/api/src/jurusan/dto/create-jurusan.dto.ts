import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateJurusanDto {
    @IsString()
    @IsNotEmpty()
    kode: string;

    @IsString()
    @IsNotEmpty()
    nama: string;

    @IsString()
    @IsOptional()
    deskripsi?: string;
}
