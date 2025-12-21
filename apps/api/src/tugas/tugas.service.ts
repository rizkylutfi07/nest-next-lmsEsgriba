import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TugasService {
    constructor(private readonly prisma: PrismaService) { }

    async create(guruId: string, data: any) {
        return this.prisma.tugas.create({
            data: { ...data, guruId },
            include: {
                mataPelajaran: true,
                guru: true,
                kelas: true,
                attachments: true,
            },
        });
    }

    async findAll(filters?: any) {
        return this.prisma.tugas.findMany({
            where: { deletedAt: null, ...filters },
            include: {
                mataPelajaran: { select: { id: true, nama: true } },
                guru: { select: { id: true, nama: true } },
                kelas: { select: { id: true, nama: true } },
                _count: { select: { submissions: true } },
            },
            orderBy: { deadline: 'asc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.tugas.findUnique({
            where: { id },
            include: {
                mataPelajaran: true,
                guru: true,
                kelas: true,
                attachments: true,
                submissions: { include: { siswa: true, files: true } },
            },
        });
    }

    async submitTugas(tugasId: string, siswaId: string, data: any) {
        return this.prisma.tugasSiswa.create({
            data: {
                tugasId,
                siswaId,
                ...data,
                status: 'DIKUMPULKAN',
                submittedAt: new Date(),
            },
            include: { files: true },
        });
    }

    async gradeTugas(tugasId: string, siswaId: string, score: number, feedback?: string) {
        return this.prisma.tugasSiswa.update({
            where: { tugasId_siswaId: { tugasId, siswaId } },
            data: {
                score,
                feedback,
                status: 'DINILAI',
                gradedAt: new Date(),
            },
        });
    }
}
