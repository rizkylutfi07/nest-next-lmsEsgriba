import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TipeNotifikasi } from '@prisma/client';

@Injectable()
export class NotifikasiService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, tipe: TipeNotifikasi, judul: string, pesan: string, linkUrl?: string) {
        return this.prisma.notifikasi.create({
            data: { userId, tipe, judul, pesan, linkUrl },
        });
    }

    async findAll(userId: string, isRead?: boolean) {
        return this.prisma.notifikasi.findMany({
            where: {
                userId,
                ...(isRead !== undefined && { isRead }),
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async markAsRead(id: string, userId: string) {
        return this.prisma.notifikasi.update({
            where: { id },
            data: { isRead: true, readAt: new Date() },
        });
    }

    async markAllAsRead(userId: string) {
        return this.prisma.notifikasi.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true, readAt: new Date() },
        });
    }
}
