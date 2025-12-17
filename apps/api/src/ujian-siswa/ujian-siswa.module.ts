import { Module } from '@nestjs/common';
import { UjianSiswaService } from './ujian-siswa.service';
import { UjianSiswaController } from './ujian-siswa.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [UjianSiswaController],
    providers: [UjianSiswaService],
    exports: [UjianSiswaService],
})
export class UjianSiswaModule { }
