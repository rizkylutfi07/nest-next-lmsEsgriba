import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { NotifikasiService } from '../notifikasi/notifikasi.service';

@Injectable()
export class PengumumanService {
    constructor(
        private prisma: PrismaService,
        private notifikasiService: NotifikasiService,
    ) { }

    async create(data: {
        judul: string;
        konten: string;
        targetRoles: Role[];
        authorId: string;
        isActive?: boolean;
    }) {
        const pengumuman = await this.prisma.pengumuman.create({
            data: {
                judul: data.judul,
                konten: data.konten,
                targetRoles: data.targetRoles,
                authorId: data.authorId,
                isActive: data.isActive ?? true,
            },
            include: {
                author: {
                    select: { name: true, email: true },
                },
            },
        });

        // Send notifications to users if announcement is active
        if (pengumuman.isActive) {
            const authorName = pengumuman.author?.name || 'Admin';
            await this.notifikasiService.notifyPengumumanBaru(
                pengumuman.id,
                pengumuman.judul,
                pengumuman.konten,
                pengumuman.targetRoles,
                authorName,
            );
        }

        return pengumuman;
    }

    async findAll(userRole?: Role) {
        const where: Prisma.PengumumanWhereInput = {
            deletedAt: null,
            isActive: true,
        };

        if (userRole && userRole !== Role.ADMIN) {
            // Show if targetRoles is empty (for everyone) OR includes the user's role
            where.OR = [
                { targetRoles: { equals: [] } },
                { targetRoles: { has: userRole } },
            ];
        }

        return this.prisma.pengumuman.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { name: true, email: true },
                },
            },
        });
    }

    async findAllForAdmin() {
        return this.prisma.pengumuman.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { name: true, email: true },
                },
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.pengumuman.findUnique({
            where: { id },
            include: {
                author: {
                    select: { name: true, email: true },
                },
            },
        });
    }

    async update(id: string, data: Prisma.PengumumanUpdateInput) {
        return this.prisma.pengumuman.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.pengumuman.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
