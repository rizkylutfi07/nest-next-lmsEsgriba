import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJadwalPelajaranDto } from './dto/create-jadwal-pelajaran.dto';
import { UpdateJadwalPelajaranDto } from './dto/update-jadwal-pelajaran.dto';

@Injectable()
export class JadwalPelajaranService {
    constructor(private prisma: PrismaService) { }

    async findAll(kelasId?: string, hari?: string, user?: any) {
        const where: any = {};

        console.log('[JadwalPelajaran] User:', JSON.stringify(user, null, 2));

        // Auto-filter for SISWA: show only their class schedule
        if (user?.role === 'SISWA') {
            console.log('[JadwalPelajaran] Filtering for SISWA, userId:', user.userId);

            // Get siswa's kelasId from database
            const siswa = await this.prisma.siswa.findUnique({
                where: { userId: user.userId },
                select: { kelasId: true, nama: true },
            });

            console.log('[JadwalPelajaran] Found siswa:', JSON.stringify(siswa, null, 2));

            if (siswa?.kelasId) {
                where.kelasId = siswa.kelasId;
                console.log('[JadwalPelajaran] Using kelasId filter:', siswa.kelasId);
            } else {
                console.warn('[JadwalPelajaran] WARNING: Siswa has no kelasId!', {
                    userId: user.userId,
                    siswaFound: !!siswa,
                    siswaData: siswa
                });
                // Temporarily return all for debugging - REMOVE IN PRODUCTION
                console.log('[JadwalPelajaran] Returning all jadwal (NO FILTER) for debugging');
            }
        } else {
            console.log('[JadwalPelajaran] Not SISWA role, using kelasId param:', kelasId);
            // For non-SISWA, use provided kelasId filter
            if (kelasId) where.kelasId = kelasId;
        }

        if (hari) where.hari = hari;

        console.log('[JadwalPelajaran] Final where:', JSON.stringify(where, null, 2));

        const result = await this.prisma.jadwalPelajaran.findMany({
            where,
            include: {
                kelas: true,
                mataPelajaran: true,
                guru: true,
            },
            orderBy: [
                { hari: 'asc' },
                { jamMulai: 'asc' },
            ],
        });

        console.log('[JadwalPelajaran] Found', result.length, 'jadwal records');

        return result;
    }

    async findByKelas(kelasId: string) {
        return this.prisma.jadwalPelajaran.findMany({
            where: { kelasId },
            include: {
                kelas: true,
                mataPelajaran: true,
                guru: true,
            },
            orderBy: [
                { hari: 'asc' },
                { jamMulai: 'asc' },
            ],
        });
    }

    async findOne(id: string) {
        return this.prisma.jadwalPelajaran.findUnique({
            where: { id },
            include: {
                kelas: true,
                mataPelajaran: true,
                guru: true,
            },
        });
    }

    async create(dto: CreateJadwalPelajaranDto) {
        return this.prisma.jadwalPelajaran.create({
            data: dto,
            include: {
                kelas: true,
                mataPelajaran: true,
                guru: true,
            },
        });
    }

    async update(id: string, dto: UpdateJadwalPelajaranDto) {
        return this.prisma.jadwalPelajaran.update({
            where: { id },
            data: dto,
            include: {
                kelas: true,
                mataPelajaran: true,
                guru: true,
            },
        });
    }

    async remove(id: string) {
        return this.prisma.jadwalPelajaran.delete({
            where: { id },
        });
    }
}
