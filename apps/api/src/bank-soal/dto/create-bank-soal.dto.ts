import { IsString, IsEnum, IsOptional, IsInt, IsNotEmpty, IsJSON, Min } from 'class-validator';
import { TipeSoal } from '@prisma/client';

export class CreateBankSoalDto {
    @IsString()
    @IsNotEmpty()
    kode: string;

    @IsString()
    @IsNotEmpty()
    pertanyaan: string;

    @IsEnum(TipeSoal)
    @IsOptional()
    tipe?: TipeSoal = TipeSoal.PILIHAN_GANDA;

    @IsString()
    @IsOptional()
    mataPelajaranId?: string;

    @IsOptional()
    pilihanJawaban?: any; // JSON array for multiple choice: [{id, text, isCorrect}]

    @IsString()
    @IsOptional()
    jawabanBenar?: string; // For essay/short answer

    @IsInt()
    @Min(1)
    @IsOptional()
    bobot?: number = 1;

    @IsString()
    @IsOptional()
    penjelasan?: string;
}
