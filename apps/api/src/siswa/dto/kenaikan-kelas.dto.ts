import { IsNotEmpty, IsString, IsArray, ValidateIf, IsBoolean, IsOptional } from 'class-validator';

export class KenaikanKelasDto {
    @IsString()
    @IsNotEmpty()
    kelasAsalId: string;

    @IsString()
    @ValidateIf((o) => !o.isGraduation) // Only required if NOT graduating
    @IsNotEmpty()
    kelasTujuanId?: string;

    @ValidateIf((o) => o.siswaIds !== 'all')
    @IsArray()
    @IsString({ each: true })
    siswaIds: string[] | 'all';

    @IsBoolean()
    @IsOptional()
    isGraduation?: boolean;

    @IsString()
    @ValidateIf((o) => !o.isGraduation) // Only required if NOT graduating
    @IsNotEmpty()
    tahunAjaranTujuanId?: string;
}
