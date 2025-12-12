import { IsNotEmpty, IsOptional, IsString, IsInt, IsEnum, IsDateString } from 'class-validator';

export class CreateMataPelajaranDto {
  @IsString()
  @IsNotEmpty()
  kode: string;

  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsInt()
  @IsNotEmpty()
  jamPelajaran: number;

  @IsString()
  @IsOptional()
  deskripsi?: string;

  @IsString()
  @IsNotEmpty()
  tingkat: string;

}
