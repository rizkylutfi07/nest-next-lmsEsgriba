import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKelasDto } from './dto/create-kelas.dto';
import { UpdateKelasDto } from './dto/update-kelas.dto';
import { QueryKelasDto } from './dto/query-kelas.dto';

@Injectable()
export class KelasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryKelasDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.kelas.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.kelas.count({ where }),
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
    const item = await this.prisma.kelas.findFirst({
      where: { id, deletedAt: null },
    });

    if (!item) {
      throw new NotFoundException(`Kelas dengan ID ${id} tidak ditemukan`);
    }

    return item;
  }

  async create(dto: CreateKelasDto) {
    return this.prisma.kelas.create({
      data: dto as any,
    });
  }

  async update(id: string, dto: UpdateKelasDto) {
    await this.findOne(id);
    return this.prisma.kelas.update({
      where: { id },
      data: dto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.kelas.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Kelas berhasil dihapus' };
  }
}
