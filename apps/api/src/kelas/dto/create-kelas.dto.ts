import { IsNotEmpty, IsOptional, IsString, IsInt, IsEnum, IsDateString } from 'class-validator';

export class CreateKelasDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  tingkat: string;

  @IsString()
  @IsNotEmpty()
  jurusan: string;

  @IsInt()
  @IsNotEmpty()
  kapasitas: number;

  @IsString()
  @IsNotEmpty()
  tahunAjaranId: string;

  @IsString()
  @IsOptional()
  waliKelasId?: string;

}
