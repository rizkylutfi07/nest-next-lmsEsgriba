import { IsNotEmpty, IsOptional, IsString, IsEmail, IsEnum, IsArray } from 'class-validator';
import { StatusGuru } from '@prisma/client';

export class CreateGuruDto {
  @IsString()
  @IsNotEmpty()
  nip: string;

  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  nomorTelepon?: string;

  @IsEnum(StatusGuru)
  @IsOptional()
  status?: StatusGuru;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mataPelajaranIds?: string[];
}
