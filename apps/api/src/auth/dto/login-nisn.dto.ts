import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginNisnDto {
    @IsString()
    @IsNotEmpty({ message: 'NISN tidak boleh kosong' })
    nisn!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password minimal 6 karakter' })
    password!: string;
}
