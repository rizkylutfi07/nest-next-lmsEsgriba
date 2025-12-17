import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class ImportBankSoalDto {
    @IsArray()
    @IsNotEmpty()
    soal: any[];

    @IsOptional()
    mataPelajaranId?: string;
}
