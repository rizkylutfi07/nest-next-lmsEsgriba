import { Module } from '@nestjs/common';
import { SiswaController } from './siswa.controller';
import { SiswaService } from './siswa.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SiswaController],
  providers: [SiswaService],
  exports: [SiswaService],
})
export class SiswaModule {}
