import { Controller, Get, Put, Param, Query, UseGuards, Req } from '@nestjs/common';
import { NotifikasiService } from './notifikasi.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifikasi')
@UseGuards(JwtAuthGuard)
export class NotifikasiController {
    constructor(private readonly notifikasiService: NotifikasiService) { }

    @Get()
    findAll(@Req() req: any, @Query('isRead') isRead?: boolean) {
        return this.notifikasiService.findAll(req.user.id, isRead);
    }

    @Put(':id/read')
    markAsRead(@Param('id') id: string, @Req() req: any) {
        return this.notifikasiService.markAsRead(id, req.user.id);
    }

    @Put('read-all')
    markAllAsRead(@Req() req: any) {
        return this.notifikasiService.markAllAsRead(req.user.id);
    }
}
