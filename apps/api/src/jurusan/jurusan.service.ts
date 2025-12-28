import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJurusanDto } from './dto/create-jurusan.dto';
import { UpdateJurusanDto } from './dto/update-jurusan.dto';
import { QueryJurusanDto } from './dto/query-jurusan.dto';
import * as ExcelJS from 'exceljs';

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

    async exportToExcel(): Promise<Buffer> {
        const jurusanList = await this.prisma.jurusan.findMany({
            where: { deletedAt: null },
            orderBy: { kode: 'asc' },
            include: {
                _count: {
                    select: { kelas: true },
                },
            },
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data Jurusan');

        // Define columns
        worksheet.columns = [
            { header: 'No', key: 'no', width: 5 },
            { header: 'Kode', key: 'kode', width: 10 },
            { header: 'Nama Jurusan', key: 'nama', width: 40 },
            { header: 'Deskripsi', key: 'deskripsi', width: 50 },
            { header: 'Jumlah Kelas', key: 'jumlahKelas', width: 15 },
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' },
        };
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

        // Add data
        jurusanList.forEach((jurusan, index) => {
            worksheet.addRow({
                no: index + 1,
                kode: jurusan.kode,
                nama: jurusan.nama,
                deskripsi: jurusan.deskripsi || '-',
                jumlahKelas: jurusan._count.kelas,
            });
        });

        // Auto-fit columns
        worksheet.columns.forEach((column) => {
            if (column.header !== 'Deskripsi') {
                column.alignment = { vertical: 'middle', horizontal: 'left' };
            }
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    async generateTemplate(): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Template Import');

        // Define columns
        worksheet.columns = [
            { header: 'Kode *', key: 'kode', width: 10 },
            { header: 'Nama Jurusan *', key: 'nama', width: 40 },
            { header: 'Deskripsi', key: 'deskripsi', width: 50 },
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' },
        };
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

        // Add example data
        worksheet.addRow({
            kode: 'TKJ',
            nama: 'Teknik Komputer dan Jaringan',
            deskripsi: 'Program studi yang mempelajari teknologi komputer dan jaringan',
        });
        worksheet.addRow({
            kode: 'RPL',
            nama: 'Rekayasa Perangkat Lunak',
            deskripsi: 'Program studi yang mempelajari pengembangan software',
        });

        // Add instruction sheet
        const instructionSheet = workbook.addWorksheet('Petunjuk');
        instructionSheet.getColumn(1).width = 100;
        instructionSheet.addRow(['PETUNJUK IMPORT DATA JURUSAN']);
        instructionSheet.addRow([]);
        instructionSheet.addRow(['1. Kolom yang wajib diisi ditandai dengan tanda bintang (*)']);
        instructionSheet.addRow(['2. Kode: Kode unik jurusan (contoh: TKJ, RPL, AK)']);
        instructionSheet.addRow(['3. Nama Jurusan: Nama lengkap jurusan']);
        instructionSheet.addRow(['4. Deskripsi: Keterangan tambahan (opsional)']);
        instructionSheet.addRow([]);
        instructionSheet.addRow(['CATATAN:']);
        instructionSheet.addRow(['- Pastikan kode jurusan unik dan belum digunakan']);
        instructionSheet.addRow(['- Hapus baris contoh sebelum mengimport data Anda']);

        instructionSheet.getRow(1).font = { bold: true, size: 14 };

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    async importFromExcel(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File tidak ditemukan');
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer as any);

        const worksheet = workbook.getWorksheet('Template Import') || workbook.worksheets[0];
        
        const results = {
            success: [] as any[],
            failed: [] as any[],
        };

        // Skip header row
        for (let i = 2; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            
            const kode = row.getCell(1).value?.toString().trim();
            const nama = row.getCell(2).value?.toString().trim();
            const deskripsi = row.getCell(3).value?.toString().trim() || null;

            // Skip empty rows
            if (!kode && !nama) continue;

            try {
                // Validate required fields
                if (!kode || !nama) {
                    results.failed.push({
                        row: i,
                        kode,
                        nama,
                        error: 'Kode dan Nama Jurusan wajib diisi',
                    });
                    continue;
                }

                // Check if kode already exists
                const existing = await this.prisma.jurusan.findFirst({
                    where: {
                        kode: kode,
                        deletedAt: null,
                    },
                });

                if (existing) {
                    results.failed.push({
                        row: i,
                        kode,
                        nama,
                        error: `Kode ${kode} sudah digunakan`,
                    });
                    continue;
                }

                // Create jurusan
                const created = await this.prisma.jurusan.create({
                    data: {
                        kode,
                        nama,
                        deskripsi,
                    },
                });

                results.success.push({
                    kode: created.kode,
                    nama: created.nama,
                });
            } catch (error) {
                results.failed.push({
                    row: i,
                    kode,
                    nama,
                    error: error.message || 'Gagal menyimpan data',
                });
            }
        }

        return {
            message: `Import selesai. Berhasil: ${results.success.length}, Gagal: ${results.failed.length}`,
            ...results,
        };
    }
}
