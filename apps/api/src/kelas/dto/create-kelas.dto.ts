import { IsNotEmpty, IsOptional, IsString, IsInt, IsEnum, IsDateString } from 'class-validator';

export class CreateKelasDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  tingkat: string;

  @IsInt()
  @IsNotEmpty()
  kapasitas: number;

  @IsString()
  @IsOptional()
  jurusanId?: string;

  @IsString()
  @IsOptional()
  waliKelasId?: string;

}
