import { Controller, Get, Put, Delete, Param, Query, UseGuards, Req } from '@nestjs/common';
import { NotifikasiService } from './notifikasi.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifikasi')
@UseGuards(JwtAuthGuard)
export class NotifikasiController {
    constructor(private readonly notifikasiService: NotifikasiService) { }

    // Helper to get the correct userId for notifications
    // For SISWA: use siswaId (notifications are sent to siswa.id)
    // For GURU/ADMIN: use userId (for future use if needed)
    private getUserIdForNotifications(req: any): string {
        // Notifications are sent to siswa.id, so use siswaId for students
        return req.user.siswa?.id || req.user.guru?.id || req.user.userId;
    }

    @Get()
    findAll(@Req() req: any, @Query('isRead') isRead?: boolean) {
        return this.notifikasiService.findAll(this.getUserIdForNotifications(req), isRead);
    }

    @Get('unread-count')
    getUnreadCount(@Req() req: any) {
        return this.notifikasiService.getUnreadCount(this.getUserIdForNotifications(req));
    }

    @Put(':id/read')
    markAsRead(@Param('id') id: string, @Req() req: any) {
        return this.notifikasiService.markAsRead(id, this.getUserIdForNotifications(req));
    }

    @Put('mark-all-read')
    markAllAsRead(@Req() req: any) {
        return this.notifikasiService.markAllAsRead(this.getUserIdForNotifications(req));
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Req() req: any) {
        return this.notifikasiService.delete(id, this.getUserIdForNotifications(req));
    }
}
