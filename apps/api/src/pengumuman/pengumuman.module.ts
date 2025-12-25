import { Module } from '@nestjs/common';
import { PengumumanService } from './pengumuman.service';
import { PengumumanController } from './pengumuman.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotifikasiModule } from '../notifikasi/notifikasi.module';

@Module({
    imports: [PrismaModule, NotifikasiModule],
    controllers: [PengumumanController],
    providers: [PengumumanService],
    exports: [PengumumanService],
})
export class PengumumanModule { }
