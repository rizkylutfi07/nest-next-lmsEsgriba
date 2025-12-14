import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { QuerySiswaDto } from './dto/query-siswa.dto';

@Injectable()
export class SiswaService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: QuerySiswaDto) {
    const { page = 1, limit = 10, search, kelasId, status, sortBy = 'createdAt', sortOrder = 'desc', tahunAjaranId } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nisn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (kelasId) {
      where.kelasId = kelasId;
    }

    if (status) {
      where.status = status;
    }

    // Filter by tahunAjaranId directly
    if (tahunAjaranId) {
      where.tahunAjaranId = tahunAjaranId;
    }

    // Build orderBy
    const orderBy: any = {};
    if (sortBy === 'kelas') {
      orderBy.kelas = { nama: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const [data, total] = await Promise.all([
      this.prisma.siswa.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          kelas: true,
          tahunAjaran: {
            select: {
              id: true,
              tahun: true,
              semester: true,
              status: true,
            },
          },
        },
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
      include: {
        kelas: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Siswa dengan ID ${id} tidak ditemukan`);
    }

    return item;
  }

  async create(dto: CreateSiswaDto) {
    // Validate kelas exists if kelasId provided
    if (dto.kelasId) {
      const kelas = await this.prisma.kelas.findUnique({
        where: { id: dto.kelasId },
      });
      if (!kelas) {
        throw new BadRequestException(`Kelas dengan ID ${dto.kelasId} tidak ditemukan`);
      }
    }

    return this.prisma.siswa.create({
      data: {
        nisn: dto.nisn,
        nama: dto.nama,
        tanggalLahir: new Date(dto.tanggalLahir),
        alamat: dto.alamat,
        nomorTelepon: dto.nomorTelepon,
        email: dto.email,
        status: dto.status,
        kelasId: dto.kelasId,
        tahunAjaranId: dto.tahunAjaranId,
      },
      include: {
        kelas: true,
        tahunAjaran: true,
      },
    });
  }

  async update(id: string, dto: UpdateSiswaDto) {
    await this.findOne(id);

    // Validate kelas exists if kelasId provided
    if (dto.kelasId) {
      const kelas = await this.prisma.kelas.findUnique({
        where: { id: dto.kelasId },
      });
      if (!kelas) {
        throw new BadRequestException(`Kelas dengan ID ${dto.kelasId} tidak ditemukan`);
      }
    }

    const updateData: any = {};
    if (dto.nisn !== undefined) updateData.nisn = dto.nisn;
    if (dto.nama !== undefined) updateData.nama = dto.nama;
    if (dto.tanggalLahir !== undefined) updateData.tanggalLahir = new Date(dto.tanggalLahir);
    if (dto.alamat !== undefined) updateData.alamat = dto.alamat;
    if (dto.nomorTelepon !== undefined) updateData.nomorTelepon = dto.nomorTelepon;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.kelasId !== undefined) updateData.kelasId = dto.kelasId;

    return this.prisma.siswa.update({
      where: { id },
      data: updateData,
      include: {
        kelas: true,
      },
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

  async createWithUser(dto: CreateSiswaDto, password?: string) {
    // Create user account first
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password || dto.nisn, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email || `${dto.nisn}@student.school.com`,
        name: dto.nama,
        role: 'SISWA',
        password: hashedPassword,
      },
    });

    // Create siswa linked to user
    return this.prisma.siswa.create({
      data: {
        nisn: dto.nisn,
        nama: dto.nama,
        tanggalLahir: new Date(dto.tanggalLahir),
        alamat: dto.alamat,
        nomorTelepon: dto.nomorTelepon,
        email: dto.email,
        status: dto.status,
        kelasId: dto.kelasId,
        tahunAjaranId: dto.tahunAjaranId,
        userId: user.id,
      },
      include: {
        kelas: true,
        tahunAjaran: true,
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

    // Get active tahun ajaran
    const activeTahunAjaran = await this.prisma.tahunAjaran.findFirst({
      where: { status: 'AKTIF', deletedAt: null },
    });

    if (!activeTahunAjaran) {
      throw new BadRequestException('Tidak ada tahun ajaran aktif. Silakan aktifkan tahun ajaran terlebih dahulu.');
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        // Check if NISN already exists (including soft-deleted)
        const existingSiswa = await this.prisma.siswa.findUnique({
          where: { nisn: row.nisn },
        });

        if (existingSiswa) {
          results.skipped++;
          results.errors.push({
            row: i + 2,
            error: `NISN ${row.nisn} sudah ada di database (${existingSiswa.deletedAt ? 'soft-deleted' : 'aktif'})`,
            data: row,
          });
          continue;
        }

        // Resolve kelas by name if provided
        let kelasId: string | undefined;
        if (row.kelasNama) {
          const kelas = await this.prisma.kelas.findFirst({
            where: {
              nama: row.kelasNama,
              deletedAt: null,
            },
          });
          if (kelas) {
            kelasId = kelas.id;
          }
        }

        // Create siswa
        const siswaData: CreateSiswaDto = {
          nisn: row.nisn,
          nama: row.nama,
          tanggalLahir: row.tanggalLahir,
          alamat: row.alamat,
          nomorTelepon: row.nomorTelepon,
          email: row.email,
          status: row.status || 'AKTIF',
          kelasId,
          tahunAjaranId: activeTahunAjaran.id,
        };

        // Create with or without user account
        if (row.createUserAccount) {
          await this.createWithUser(siswaData);
        } else {
          await this.create(siswaData);
        }

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 2, // +2 because Excel is 1-indexed and has header row
          error: error.message || 'Unknown error',
          data: row,
        });
      }
    }

    return results;
  }

  async kenaikanKelas(dto: any): Promise<{
    success: number;
    failed: number;
    errors: Array<{ siswaId: string; error: string }>;
  }> {
    const { kelasAsalId, kelasTujuanId, siswaIds, isGraduation, tahunAjaranTujuanId } = dto;

    // Validate Source Class
    const kelasAsal = await this.prisma.kelas.findFirst({ where: { id: kelasAsalId, deletedAt: null } });
    if (!kelasAsal) {
      throw new NotFoundException(`Kelas asal dengan ID ${kelasAsalId} tidak ditemukan`);
    }

    // Validate Target Class and Tahun Ajaran (only if NOT graduating)
    let kelasTujuan: any = null;
    if (!isGraduation) {
      if (!kelasTujuanId) {
        throw new BadRequestException('Kelas tujuan harus dipilih untuk kenaikan kelas reguler');
      }
      if (!tahunAjaranTujuanId) {
        throw new BadRequestException('Tahun ajaran tujuan harus dipilih untuk kenaikan kelas reguler');
      }
      kelasTujuan = await this.prisma.kelas.findFirst({ where: { id: kelasTujuanId, deletedAt: null } });

      if (!kelasTujuan) {
        throw new NotFoundException(`Kelas tujuan dengan ID ${kelasTujuanId} tidak ditemukan`);
      }

      if (kelasAsalId === kelasTujuanId) {
        throw new BadRequestException('Kelas asal dan tujuan tidak boleh sama');
      }

      // Validate tahun ajaran exists
      const tahunAjaranTujuan = await this.prisma.tahunAjaran.findFirst({
        where: { id: tahunAjaranTujuanId, deletedAt: null }
      });
      if (!tahunAjaranTujuan) {
        throw new NotFoundException(`Tahun ajaran tujuan dengan ID ${tahunAjaranTujuanId} tidak ditemukan`);
      }
    }

    // Get student IDs to promote/graduate
    let studentIdsToPromote: string[];
    if (siswaIds === 'all') {
      const students = await this.prisma.siswa.findMany({
        where: {
          kelasId: kelasAsalId,
          deletedAt: null,
        },
        select: { id: true, tahunAjaranId: true },
      });
      studentIdsToPromote = students.map((s) => s.id);
    } else {
      studentIdsToPromote = siswaIds;
    }

    if (studentIdsToPromote.length === 0) {
      throw new BadRequestException('Tidak ada siswa yang dipilih');
    }

    // Bulk update students with transaction
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ siswaId: string; error: string }>,
    };

    for (const siswaId of studentIdsToPromote) {
      try {
        await this.prisma.$transaction(async (tx) => {
          // Get current siswa data
          const siswa = await tx.siswa.findUnique({
            where: { id: siswaId },
            select: { kelasId: true, tahunAjaranId: true },
          });

          if (!siswa) {
            throw new Error('Siswa tidak ditemukan');
          }

          // Close previous history record if exists
          if (siswa.kelasId && siswa.tahunAjaranId) {
            await tx.siswaKelasHistory.updateMany({
              where: {
                siswaId: siswaId,
                tanggalSelesai: null, // Only close active records
              },
              data: {
                tanggalSelesai: new Date(),
                status: isGraduation ? 'SELESAI' : 'PINDAH',
              },
            });
          }

          // Update siswa
          const updateData: any = isGraduation
            ? { kelasId: null, tahunAjaranId: null, status: 'ALUMNI' } // Graduate
            : { kelasId: kelasTujuanId, tahunAjaranId: tahunAjaranTujuanId }; // Promote

          await tx.siswa.update({
            where: { id: siswaId },
            data: updateData,
          });

          // Create new history record (only if not graduating)
          if (!isGraduation) {
            await tx.siswaKelasHistory.create({
              data: {
                siswaId: siswaId,
                kelasId: kelasTujuanId,
                tahunAjaranId: tahunAjaranTujuanId,
                tanggalMulai: new Date(),
                status: 'AKTIF',
              },
            });
          }
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          siswaId,
          error: error.message || 'Unknown error',
        });
      }
    }

    return results;
  }

  async exportToExcel(): Promise<Buffer> {
    const XLSX = require('xlsx');

    const allSiswa = await this.prisma.siswa.findMany({
      where: { deletedAt: null },
      include: {
        kelas: {
          select: {
            nama: true,
          },
        },
        tahunAjaran: {
          select: {
            tahun: true,
            semester: true,
          },
        },
      },
      orderBy: { nama: 'asc' },
    });

    const exportData = allSiswa.map((siswa) => ({
      'NISN': siswa.nisn,
      'Nama Lengkap': siswa.nama,
      'Tanggal Lahir': siswa.tanggalLahir ? new Date(siswa.tanggalLahir).toISOString().split('T')[0] : '',
      'Email': siswa.email || '',
      'Alamat': siswa.alamat || '',
      'Nomor Telepon': siswa.nomorTelepon || '',
      'Status': siswa.status,
      'Kelas': siswa.kelas?.nama || '',
      'Tahun Ajaran': siswa.tahunAjaran ? `${siswa.tahunAjaran.tahun} Semester ${siswa.tahunAjaran.semester}` : '',
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}
