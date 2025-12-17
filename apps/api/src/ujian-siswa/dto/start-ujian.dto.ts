import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class StartUjianDto {
    @IsString()
    @IsNotEmpty()
    ujianId: string;

    @IsString()
    @IsOptional()
    tokenAkses?: string;
}
