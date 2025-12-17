import { IsNotEmpty, IsString, IsInt, Min, IsArray, IsOptional } from 'class-validator';

export class AddSoalDto {
    @IsArray()
    @IsNotEmpty()
    bankSoalIds: string[]; // Array of bank soal IDs to add
}

export class ImportSoalDto {
    @IsArray()
    @IsNotEmpty()
    soal: any[]; // Array of soal data from import

    @IsString()
    @IsOptional()
    mataPelajaranId?: string;
}
