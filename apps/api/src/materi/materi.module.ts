import { Module } from '@nestjs/common';
import { MateriController } from './materi.controller';
import { MateriService } from './materi.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [MateriController],
    providers: [MateriService],
    exports: [MateriService],
})
export class MateriModule { }
