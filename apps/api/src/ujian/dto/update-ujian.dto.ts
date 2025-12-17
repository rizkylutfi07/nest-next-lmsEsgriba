import { PartialType } from '@nestjs/mapped-types';
import { CreateUjianDto } from './create-ujian.dto';

export class UpdateUjianDto extends PartialType(CreateUjianDto) { }
