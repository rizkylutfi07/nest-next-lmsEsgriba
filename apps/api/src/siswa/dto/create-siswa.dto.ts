import { IsNotEmpty, IsOptional, IsString, IsInt, IsEnum, IsDateString } from 'class-validator';
import { StatusSiswa } from '@prisma/client';

export class CreateSiswaDto {
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
  kelasId?: string;

}
