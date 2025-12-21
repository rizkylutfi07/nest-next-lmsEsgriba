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
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
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

  async createWithUser(dto: CreateGuruDto, password?: string) {
    // Create user account first
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password || dto.nip, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.nama,
        role: 'GURU',
        password: hashedPassword,
      },
    });

    // Prepare mataPelajaran connection
    const mataPelajaranConnect = dto.mataPelajaranIds?.length
      ? { connect: dto.mataPelajaranIds.map((id) => ({ id })) }
      : undefined;

    // Create guru linked to user
    return this.prisma.guru.create({
      data: {
        nip: dto.nip,
        nama: dto.nama,
        email: dto.email,
        nomorTelepon: dto.nomorTelepon,
        status: dto.status,
        userId: user.id,
        mataPelajaran: mataPelajaranConnect,
      },
      include: {
        mataPelajaran: true,
        user: true,
      },
    });
  }

  async importFromExcel(rows: any[]): Promise<{
    success: number;
    failed: number;
    skipped: number;
    errors: Array<{ row: number; error: string; data: any }>;
  }> {
    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as Array<{ row: number; error: string; data: any }>,
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        // Check if guru already exists by NIP or email
        const existing = await this.prisma.guru.findFirst({
          where: {
            OR: [
              { nip: row.nip },
              { email: row.email },
            ],
            deletedAt: null,
          },
        });

        if (existing) {
          results.skipped++;
          results.errors.push({
            row: i + 2,
            error: `NIP ${row.nip} atau Email ${row.email} sudah ada di database`,
            data: row,
          });
          continue;
        }

        // Create guru data
        const guruData: CreateGuruDto = {
          nip: row.nip,
          nama: row.nama,
          email: row.email,
          nomorTelepon: row.nomorTelepon,
          status: row.status || 'AKTIF',
        };

        // Always create user account automatically when importing
        // Use NIP as default password
        await this.createWithUser(guruData, row.nip);

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 2,
          error: error.message || 'Unknown error',
          data: row,
        });
      }
    }

    return results;
  }

  async exportToExcel(): Promise<Buffer> {
    const XLSX = require('xlsx');

    const allGuru = await this.prisma.guru.findMany({
      where: { deletedAt: null },
      include: {
        mataPelajaran: {
          select: {
            kode: true,
            nama: true,
          },
        },
      },
      orderBy: { nama: 'asc' },
    });

    const exportData = allGuru.map((guru) => ({
      'NIP': guru.nip,
      'Nama Lengkap': guru.nama,
      'Email': guru.email,
      'Nomor Telepon': guru.nomorTelepon || '',
      'Status': guru.status,
      'Mata Pelajaran': guru.mataPelajaran?.map(mp => `${mp.kode} - ${mp.nama}`).join(', ') || '',
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Guru');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}
