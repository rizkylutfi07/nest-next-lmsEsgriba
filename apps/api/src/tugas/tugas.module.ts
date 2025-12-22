import { Module } from '@nestjs/common';
import { TugasController } from './tugas.controller';
import { TugasService } from './tugas.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotifikasiModule } from '../notifikasi/notifikasi.module';

@Module({
    imports: [PrismaModule, NotifikasiModule],
    controllers: [TugasController],
    providers: [TugasService],
    exports: [TugasService],
})
export class TugasModule { }
