import { Module } from '@nestjs/common';
import { TahunAjaranController } from './tahun-ajaran.controller';
import { TahunAjaranService } from './tahun-ajaran.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [TahunAjaranController],
    providers: [TahunAjaranService],
    exports: [TahunAjaranService],
})
export class TahunAjaranModule { }
