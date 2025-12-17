import { IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class JawabanItem {
    soalId: string;
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
