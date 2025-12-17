import { Module } from '@nestjs/common';
import { PaketSoalService } from './paket-soal.service';
import { PaketSoalController } from './paket-soal.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PaketSoalController],
    providers: [PaketSoalService],
    exports: [PaketSoalService],
})
export class PaketSoalModule { }
