import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateSettingsDto {
    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    value: string;
}
