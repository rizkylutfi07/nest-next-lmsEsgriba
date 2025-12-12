import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJurusanDto } from './dto/create-jurusan.dto';
import { UpdateJurusanDto } from './dto/update-jurusan.dto';
import { QueryJurusanDto } from './dto/query-jurusan.dto';

@Injectable()
export class JurusanService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(query: QueryJurusanDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const where: any = { deletedAt: null };

        if (search) {
            where.OR = [
                { kode: { contains: search, mode: 'insensitive' } },
                { nama: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [data, total] = await Promise.all([
            this.prisma.jurusan.findMany({
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
            this.prisma.jurusan.count({ where }),
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
        const jurusan = await this.prisma.jurusan.findFirst({
            where: { id, deletedAt: null },
            include: {
                _count: {
                    select: { kelas: true },
                },
            },
        });

        if (!jurusan) {
            throw new NotFoundException(`Jurusan dengan ID ${id} tidak ditemukan`);
        }

        return jurusan;
    }

    async create(dto: CreateJurusanDto) {
        const exists = await this.prisma.jurusan.findFirst({
            where: {
                kode: dto.kode,
                deletedAt: null,
            },
        });

        if (exists) {
            throw new BadRequestException(`Kode jurusan ${dto.kode} sudah ada`);
        }

        return this.prisma.jurusan.create({
            data: {
                kode: dto.kode,
                nama: dto.nama,
                deskripsi: dto.deskripsi,
            },
        });
    }

    async update(id: string, dto: UpdateJurusanDto) {
        await this.findOne(id);

        const updateData: any = {};
        if (dto.kode) updateData.kode = dto.kode;
        if (dto.nama) updateData.nama = dto.nama;
        if (dto.deskripsi !== undefined) updateData.deskripsi = dto.deskripsi;

        return this.prisma.jurusan.update({
            where: { id },
            data: updateData,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.jurusan.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return { message: 'Jurusan berhasil dihapus' };
    }
}
