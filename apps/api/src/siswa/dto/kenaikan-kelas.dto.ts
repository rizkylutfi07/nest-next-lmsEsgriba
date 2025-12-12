import { IsNotEmpty, IsString, IsArray, ValidateIf } from 'class-validator';

export class KenaikanKelasDto {
    @IsString()
    @IsNotEmpty()
    kelasAsalId: string;

    @IsString()
    @IsNotEmpty()
    kelasTujuanId: string;

    @ValidateIf((o) => o.siswaIds !== 'all')
    @IsArray()
    @IsString({ each: true })
    siswaIds: string[] | 'all';
}
