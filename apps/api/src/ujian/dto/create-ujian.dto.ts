import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsInt,
    IsBoolean,
    IsDateString,
    IsArray,
    Min,
} from 'class-validator';

export class CreateUjianDto {
    @IsString()
    @IsNotEmpty()
    judul: string;

    @IsString()
    @IsOptional()
    deskripsi?: string;

    @IsString()
    @IsOptional()
    mataPelajaranId?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    kelasIds?: string[]; // Array of class IDs for multi-class selection

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    siswaIds?: string[]; // Array of specific student IDs (optional)

    @IsInt()
    @Min(1)
    durasi: number; // in minutes

    @IsDateString()
    tanggalMulai: string;

    @IsDateString()
    tanggalSelesai: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    nilaiMinimal?: number; // passing grade

    @IsBoolean()
    @IsOptional()
    acakSoal?: boolean = true;

    @IsBoolean()
    @IsOptional()
    tampilkanNilai?: boolean = false;

    @IsArray()
    @IsString({ each: true })
    soalIds: string[]; // Array of BankSoal IDs
}
