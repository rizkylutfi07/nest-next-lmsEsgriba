import { PartialType } from '@nestjs/mapped-types';
import { CreateBankSoalDto } from './create-bank-soal.dto';

export class UpdateBankSoalDto extends PartialType(CreateBankSoalDto) { }
