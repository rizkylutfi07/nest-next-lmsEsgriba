import { IsNotEmpty, IsOptional, IsString, IsInt, IsEnum, IsDateString } from 'class-validator';
import { StatusGuru } from '@prisma/client';

export class CreateGuruDto {
  @IsString()
  @IsNotEmpty()
  nip: string;

  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  nomorTelepon?: string;

  @IsEnum(StatusGuru)
  @IsNotEmpty()
  status: StatusGuru;

  @IsString()
  @IsOptional()
  mataPelajaranId?: string;

}
