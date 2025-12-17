import { PartialType } from '@nestjs/mapped-types';
import { CreatePaketSoalDto } from './create-paket-soal.dto';

export class UpdatePaketSoalDto extends PartialType(CreatePaketSoalDto) { }
