import { IsArray, ValidateNested, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

class GradeItemDto {
    @IsString()
    soalId: string;

    @IsNumber()
    @Min(0)
    score: number;
}

export class GradeExamDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GradeItemDto)
    grades: GradeItemDto[];
}
