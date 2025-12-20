import { PartialType } from '@nestjs/mapped-types';
import { CreateJadwalPelajaranDto } from './create-jadwal-pelajaran.dto';

export class UpdateJadwalPelajaranDto extends PartialType(CreateJadwalPelajaranDto) { }
