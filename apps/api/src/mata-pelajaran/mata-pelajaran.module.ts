import { Module } from '@nestjs/common';
import { MataPelajaranController } from './mata-pelajaran.controller';
import { MataPelajaranService } from './mata-pelajaran.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MataPelajaranController],
  providers: [MataPelajaranService],
  exports: [MataPelajaranService],
})
export class MataPelajaranModule {}
