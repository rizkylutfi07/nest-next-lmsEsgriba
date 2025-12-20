import { Module } from '@nestjs/common';
import { JadwalPelajaranController } from './jadwal-pelajaran.controller';
import { JadwalPelajaranService } from './jadwal-pelajaran.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [JadwalPelajaranController],
    providers: [JadwalPelajaranService],
    exports: [JadwalPelajaranService],
})
export class JadwalPelajaranModule { }
