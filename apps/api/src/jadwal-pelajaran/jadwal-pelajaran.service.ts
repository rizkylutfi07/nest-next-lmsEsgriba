import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJadwalPelajaranDto } from './dto/create-jadwal-pelajaran.dto';
import { UpdateJadwalPelajaranDto } from './dto/update-jadwal-pelajaran.dto';

@Injectable()
export class JadwalPelajaranService {
    constructor(private prisma: PrismaService) { }

    async findAll(kelasId?: string, hari?: string) {
        const where: any = {};
        if (kelasId) where.kelasId = kelasId;
        if (hari) where.hari = hari;
        return this.prisma.jadwalPelajaran.findMany({
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
