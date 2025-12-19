import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class JawabanItem {
    @IsString()
    soalId: string;

    @IsString()
    jawaban: string;
}

export class SubmitJawabanDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => JawabanItem)
    jawaban: JawabanItem[];

    @IsBoolean()
    @IsOptional()
    isAutoSubmit?: boolean = false;
}
