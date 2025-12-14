import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKelasDto } from './dto/create-kelas.dto';
import { UpdateKelasDto } from './dto/update-kelas.dto';
import { QueryKelasDto } from './dto/query-kelas.dto';

@Injectable()
export class KelasService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: QueryKelasDto) {
    const { page = 1, limit = 10, search, tahunAjaranId } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by tahunAjaranId through Siswa relation if provided
    if (tahunAjaranId) {
      where.siswa = {
        some: {
          tahunAjaranId: tahunAjaranId,
        },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.kelas.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          jurusan: {
            select: {
              id: true,
              kode: true,
              nama: true,
            },
          },
          _count: {
            select: { siswa: true },
          },
        },
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
      include: {
        jurusan: {
          select: {
            id: true,
            kode: true,
            nama: true,
          },
        },
      },
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
        // Check if kelas already exists by name
        const existingKelas = await this.prisma.kelas.findFirst({
          where: { nama: row.nama, deletedAt: null },
        });

        if (existingKelas) {
          results.skipped++;
          results.errors.push({
            row: i + 2,
            error: `Kelas ${row.nama} sudah ada di database`,
            data: row,
          });
          continue;
        }

        // Resolve jurusanId by kode if provided
        let jurusanId: string | undefined;
        if (row.kodeJurusan) {
          const jurusan = await this.prisma.jurusan.findFirst({
            where: { kode: row.kodeJurusan, deletedAt: null },
          });
          if (jurusan) {
            jurusanId = jurusan.id;
          }
        }

        // Resolve waliKelasId by NIP if provided
        let waliKelasId: string | undefined;
        if (row.nipWaliKelas) {
          const guru = await this.prisma.guru.findFirst({
            where: { nip: row.nipWaliKelas, deletedAt: null },
          });
          if (guru) {
            waliKelasId = guru.id;
          }
        }

        // Create kelas
        await this.prisma.kelas.create({
          data: {
            nama: row.nama,
            tingkat: row.tingkat,
            kapasitas: row.kapasitas || 32,
            jurusanId,
            waliKelasId,
          },
        });

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

    const allKelas = await this.prisma.kelas.findMany({
      where: { deletedAt: null },
      include: {
        jurusan: {
          select: {
            kode: true,
            nama: true,
          },
        },
        waliKelas: {
          select: {
            nip: true,
            nama: true,
          },
        },
      },
      orderBy: { nama: 'asc' },
    });

    const exportData = allKelas.map((kelas) => ({
      'Nama Kelas': kelas.nama,
      'Tingkat': kelas.tingkat,
      'Kapasitas': kelas.kapasitas,
      'Kode Jurusan': kelas.jurusan?.kode || '',
      'Nama Jurusan': kelas.jurusan?.nama || '',
      'NIP Wali Kelas': kelas.waliKelas?.nip || '',
      'Nama Wali Kelas': kelas.waliKelas?.nama || '',
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Kelas');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}
