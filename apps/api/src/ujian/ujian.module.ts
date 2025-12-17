import { Module } from '@nestjs/common';
import { UjianService } from './ujian.service';
import { UjianController } from './ujian.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [UjianController],
    providers: [UjianService],
    exports: [UjianService],
})
export class UjianModule { }
