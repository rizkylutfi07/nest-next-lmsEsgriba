import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuruDto } from './dto/create-guru.dto';
import { UpdateGuruDto } from './dto/update-guru.dto';
import { QueryGuruDto } from './dto/query-guru.dto';

@Injectable()
export class GuruService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryGuruDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.guru.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.guru.count({ where }),
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
    const item = await this.prisma.guru.findFirst({
      where: { id, deletedAt: null },
    });

    if (!item) {
      throw new NotFoundException(`Guru dengan ID ${id} tidak ditemukan`);
    }

    return item;
  }

  async create(dto: CreateGuruDto) {
    return this.prisma.guru.create({
      data: dto as any,
    });
  }

  async update(id: string, dto: UpdateGuruDto) {
    await this.findOne(id);
    return this.prisma.guru.update({
      where: { id },
      data: dto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.guru.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Guru berhasil dihapus' };
  }
}
