import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusSiswa } from '@prisma/client';

export class QuerySiswaDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  kelasId?: string;

  @IsOptional()
  @IsEnum(StatusSiswa)
  status?: StatusSiswa;

  @IsOptional()
  @IsString()
  sortBy?: string; // e.g., 'nama', 'nisn', 'createdAt'

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  tahunAjaranId?: string; // Filter by academic year (through Kelas)
}
