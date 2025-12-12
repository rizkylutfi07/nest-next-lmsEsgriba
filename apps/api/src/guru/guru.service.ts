import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuruDto } from './dto/create-guru.dto';
import { UpdateGuruDto } from './dto/update-guru.dto';
import { QueryGuruDto } from './dto/query-guru.dto';

@Injectable()
export class GuruService {
  constructor(private readonly prisma: PrismaService) { }

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
        include: {
          mataPelajaran: {
            select: {
              id: true,
              kode: true,
              nama: true,
            },
          },
        },
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
      include: {
        mataPelajaran: {
          select: {
            id: true,
            kode: true,
            nama: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Guru dengan ID ${id} tidak ditemukan`);
    }

    return item;
  }

  async create(dto: CreateGuruDto) {
    const exists = await this.prisma.guru.findFirst({
      where: {
        OR: [
          { nip: dto.nip },
          { email: dto.email },
        ],
        deletedAt: null,
      },
    });

    if (exists) {
      throw new BadRequestException('NIP atau Email sudah terdaftar');
    }

    const { mataPelajaranIds, ...guruData } = dto;

    return this.prisma.guru.create({
      data: {
        ...guruData,
        mataPelajaran: {
          connect: mataPelajaranIds?.map(id => ({ id })) || [],
        },
      },
      include: {
        mataPelajaran: true,
      },
    });
  }

  async update(id: string, dto: UpdateGuruDto) {
    await this.findOne(id);

    const { mataPelajaranIds, ...guruData } = dto;

    return this.prisma.guru.update({
      where: { id },
      data: {
        ...guruData,
        mataPelajaran: {
          set: mataPelajaranIds?.map(id => ({ id })) || [],
        },
      },
      include: {
        mataPelajaran: true,
      },
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
