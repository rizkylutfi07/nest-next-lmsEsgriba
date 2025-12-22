import { Module } from '@nestjs/common';
import { NotifikasiController } from './notifikasi.controller';
import { NotifikasiService } from './notifikasi.service';
import { DeadlineReminderService } from './deadline-reminder.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [NotifikasiController],
    providers: [NotifikasiService, DeadlineReminderService],
    exports: [NotifikasiService],
})
export class NotifikasiModule { }
