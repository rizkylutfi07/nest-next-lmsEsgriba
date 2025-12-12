import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { QuerySiswaDto } from './dto/query-siswa.dto';

@Injectable()
export class SiswaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QuerySiswaDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.siswa.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.siswa.count({ where }),
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
    const item = await this.prisma.siswa.findFirst({
      where: { id, deletedAt: null },
    });

    if (!item) {
      throw new NotFoundException(`Siswa dengan ID ${id} tidak ditemukan`);
    }

    return item;
  }

  async create(dto: CreateSiswaDto) {
    return this.prisma.siswa.create({
      data: dto as any,
    });
  }

  async update(id: string, dto: UpdateSiswaDto) {
    await this.findOne(id);
    return this.prisma.siswa.update({
      where: { id },
      data: dto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.siswa.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Siswa berhasil dihapus' };
  }
}
