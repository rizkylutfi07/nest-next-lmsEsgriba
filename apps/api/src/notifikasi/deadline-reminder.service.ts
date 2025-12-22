import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotifikasiService } from './notifikasi.service';

@Injectable()
export class DeadlineReminderService {
    private readonly logger = new Logger(DeadlineReminderService.name);

    constructor(private readonly notifikasiService: NotifikasiService) { }

    /**
     * Run daily at 07:00 WIB to check for upcoming deadlines
     * Sends reminders for H-3, H-1, and H-0 (day of deadline)
     */
    @Cron('0 7 * * *', {
        timeZone: 'Asia/Jakarta',
    })
    async handleDeadlineReminders() {
        this.logger.log('Running deadline reminder cron job...');

        try {
            const result = await this.notifikasiService.sendDeadlineReminders();
            this.logger.log(`Deadline reminder job completed. Sent ${result.sent} notifications.`);
        } catch (error) {
            this.logger.error('Error in deadline reminder cron job:', error);
        }
    }

    /**
     * Manual trigger for testing purposes
     */
    async triggerManually() {
        this.logger.log('Manually triggering deadline reminders...');
        return this.notifikasiService.sendDeadlineReminders();
    }
}
