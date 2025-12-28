import { Module } from '@nestjs/common';
import { UjianService } from './ujian.service';
import { UjianController } from './ujian.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UjianScheduler } from './ujian.scheduler';

@Module({
    imports: [PrismaModule],
    controllers: [UjianController],
    providers: [UjianService, UjianScheduler],
    exports: [UjianService],
})
export class UjianModule { }
