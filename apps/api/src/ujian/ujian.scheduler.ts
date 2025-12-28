import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { StatusUjian } from '@prisma/client';

@Injectable()
export class UjianScheduler {
    private readonly logger = new Logger(UjianScheduler.name);

    constructor(private prisma: PrismaService) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        // Find exams that are ONGOING and past their end time
        const now = new Date();

        const expiredExams = await this.prisma.ujian.findMany({
            where: {
                status: StatusUjian.ONGOING,
                tanggalSelesai: {
                    lte: now,
                },
                deletedAt: null,
            },
            select: {
                id: true,
                judul: true,
            },
        });

        if (expiredExams.length > 0) {
            this.logger.log(`Found ${expiredExams.length} expired exams. Finishing them...`);

            // Update status to SELESAI
            const updateResult = await this.prisma.ujian.updateMany({
                where: {
                    id: {
                        in: expiredExams.map(ujian => ujian.id),
                    },
                },
                data: {
                    status: StatusUjian.SELESAI,
                },
            });

            this.logger.log(`Successfully finished ${updateResult.count} exams.`);

            // Optional: Log individual exam titles
            expiredExams.forEach(ujian => {
                this.logger.log(`Auto-finished exam: ${ujian.judul} (${ujian.id})`);
            });
        }
    }
}
