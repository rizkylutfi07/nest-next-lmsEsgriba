import { Module } from '@nestjs/common';
import { BankSoalService } from './bank-soal.service';
import { BankSoalController } from './bank-soal.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BankSoalController],
    providers: [BankSoalService],
    exports: [BankSoalService],
})
export class BankSoalModule { }
