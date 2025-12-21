import { Module } from '@nestjs/common';
import { TugasController } from './tugas.controller';
import { TugasService } from './tugas.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [TugasController],
    providers: [TugasService],
    exports: [TugasService],
})
export class TugasModule { }
