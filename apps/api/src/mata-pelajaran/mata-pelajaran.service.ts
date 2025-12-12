import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMataPelajaranDto } from './dto/create-mata-pelajaran.dto';
import { UpdateMataPelajaranDto } from './dto/update-mata-pelajaran.dto';
import { QueryMataPelajaranDto } from './dto/query-mata-pelajaran.dto';

@Injectable()
export class MataPelajaranService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryMataPelajaranDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.mataPelajaran.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.mataPelajaran.count({ where }),
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
    const item = await this.prisma.mataPelajaran.findFirst({
      where: { id, deletedAt: null },
    });

    if (!item) {
      throw new NotFoundException(`MataPelajaran dengan ID ${id} tidak ditemukan`);
    }

    return item;
  }

  async create(dto: CreateMataPelajaranDto) {
    return this.prisma.mataPelajaran.create({
      data: dto as any,
    });
  }

  async update(id: string, dto: UpdateMataPelajaranDto) {
    await this.findOne(id);
    return this.prisma.mataPelajaran.update({
      where: { id },
      data: dto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.mataPelajaran.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'MataPelajaran berhasil dihapus' };
  }
}
