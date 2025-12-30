import { Module } from '@nestjs/common';
import { RppController } from './rpp.controller';
import { RppService } from './rpp.service';
import { AiRppService } from './ai-rpp.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [RppController],
    providers: [RppService, AiRppService],
    exports: [RppService, AiRppService],
})
export class RppModule { }
