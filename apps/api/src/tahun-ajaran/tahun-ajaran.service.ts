import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTahunAjaranDto } from './dto/create-tahun-ajaran.dto';
import { UpdateTahunAjaranDto } from './dto/update-tahun-ajaran.dto';
import { QueryTahunAjaranDto } from './dto/query-tahun-ajaran.dto';

@Injectable()
export class TahunAjaranService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(query: QueryTahunAjaranDto) {
        const { page = 1, limit = 10, search, status } = query;
        const skip = (page - 1) * limit;

        const where: any = {
            deletedAt: null, // Only non-deleted records
        };

        if (search) {
            where.tahun = { contains: search, mode: 'insensitive' };
        }

        if (status) {
            where.status = status;
        }

        const [data, total] = await Promise.all([
            this.prisma.tahunAjaran.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { kelas: true },
                    },
                },
            }),
            this.prisma.tahunAjaran.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const tahunAjaran = await this.prisma.tahunAjaran.findFirst({
            where: { id, deletedAt: null },
            include: {
                _count: {
                    select: { kelas: true },
                },
            },
        });

        if (!tahunAjaran) {
            throw new NotFoundException(`Tahun Ajaran dengan ID ${id} tidak ditemukan`);
        }

        return tahunAjaran;
    }

    async create(dto: CreateTahunAjaranDto) {
        // Check if tahun+semester combination already exists
        const exists = await this.prisma.tahunAjaran.findFirst({
            where: {
                tahun: dto.tahun,
                semester: dto.semester,
                deletedAt: null,
            },
        });

        if (exists) {
            throw new BadRequestException(
                `Tahun Ajaran ${dto.tahun} Semester ${dto.semester} sudah ada`,
            );
        }

        return this.prisma.tahunAjaran.create({
            data: {
                tahun: dto.tahun,
                semester: dto.semester,
                tanggalMulai: new Date(dto.tanggalMulai),
                tanggalSelesai: new Date(dto.tanggalSelesai),
                status: dto.status,
            },
        });
    }

    async update(id: string, dto: UpdateTahunAjaranDto) {
        await this.findOne(id); // Check if exists

        const updateData: any = {};
        if (dto.tahun) updateData.tahun = dto.tahun;
        if (dto.semester) updateData.semester = dto.semester;
        if (dto.tanggalMulai) updateData.tanggalMulai = new Date(dto.tanggalMulai);
        if (dto.tanggalSelesai) updateData.tanggalSelesai = new Date(dto.tanggalSelesai);
        if (dto.status) updateData.status = dto.status;

        return this.prisma.tahunAjaran.update({
            where: { id },
            data: updateData,
        });
    }

    async remove(id: string) {
        await this.findOne(id); // Check if exists

        // Soft delete
        await this.prisma.tahunAjaran.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return { message: 'Tahun Ajaran berhasil dihapus' };
    }

    async getActive() {
        const activeTahunAjaran = await this.prisma.tahunAjaran.findFirst({
            where: {
                status: 'AKTIF',
                deletedAt: null,
            },
            include: {
                _count: {
                    select: { kelas: true },
                },
            },
        });

        if (!activeTahunAjaran) {
            throw new NotFoundException('Tidak ada Tahun Ajaran yang aktif');
        }

        return activeTahunAjaran;
    }

    async setActive(id: string) {
        // Verify tahun ajaran exists
        await this.findOne(id);

        // Deactivate all other tahun ajaran (set to SELESAI if they were AKTIF)
        await this.prisma.tahunAjaran.updateMany({
            where: {
                status: 'AKTIF',
                deletedAt: null,
                id: { not: id },
            },
            data: { status: 'SELESAI' },
        });

        // Set this one as active
        const updated = await this.prisma.tahunAjaran.update({
            where: { id },
            data: { status: 'AKTIF' },
            include: {
                _count: {
                    select: { kelas: true },
                },
            },
        });

        return {
            message: `Tahun Ajaran ${updated.tahun} Semester ${updated.semester} berhasil diaktifkan`,
            data: updated,
        };
    }
}
