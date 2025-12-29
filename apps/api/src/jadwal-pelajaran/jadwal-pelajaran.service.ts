import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJadwalPelajaranDto } from './dto/create-jadwal-pelajaran.dto';
import { UpdateJadwalPelajaranDto } from './dto/update-jadwal-pelajaran.dto';

@Injectable()
export class JadwalPelajaranService {
    constructor(private prisma: PrismaService) { }

    async findAll(kelasId?: string, hari?: string, user?: any) {
        const where: any = {};

        console.log('[JadwalPelajaran] User:', JSON.stringify(user, null, 2));

        // Auto-filter for SISWA: show only their class schedule
        if (user?.role === 'SISWA') {
            console.log('[JadwalPelajaran] Filtering for SISWA, userId:', user.userId);

            // Get siswa's kelasId from database
            const siswa = await this.prisma.siswa.findUnique({
                where: { userId: user.userId },
                select: { kelasId: true, nama: true },
            });

            console.log('[JadwalPelajaran] Found siswa:', JSON.stringify(siswa, null, 2));

            if (siswa?.kelasId) {
                where.kelasId = siswa.kelasId;
                console.log('[JadwalPelajaran] Using kelasId filter:', siswa.kelasId);
            } else {
                console.warn('[JadwalPelajaran] WARNING: Siswa has no kelasId!', {
                    userId: user.userId,
                    siswaFound: !!siswa,
                    siswaData: siswa
                });
                // Temporarily return all for debugging - REMOVE IN PRODUCTION
                console.log('[JadwalPelajaran] Returning all jadwal (NO FILTER) for debugging');
            }
        } else {
            console.log('[JadwalPelajaran] Not SISWA role, using kelasId param:', kelasId);
            // For non-SISWA, use provided kelasId filter
            if (kelasId) where.kelasId = kelasId;
        }

        if (hari) where.hari = hari;

        console.log('[JadwalPelajaran] Final where:', JSON.stringify(where, null, 2));

        const result = await this.prisma.jadwalPelajaran.findMany({
            where,
            include: {
                kelas: true,
                mataPelajaran: true,
                guru: true,
            },
            orderBy: [
                { hari: 'asc' },
                { jamMulai: 'asc' },
            ],
        });

        console.log('[JadwalPelajaran] Found', result.length, 'jadwal records');

        return result;
    }

    async findByKelas(kelasId: string) {
        return this.prisma.jadwalPelajaran.findMany({
            where: { kelasId },
            include: {
                kelas: true,
                mataPelajaran: true,
                guru: true,
            },
            orderBy: [
                { hari: 'asc' },
                { jamMulai: 'asc' },
            ],
        });
    }

    async findOne(id: string) {
        return this.prisma.jadwalPelajaran.findUnique({
            where: { id },
            include: {
                kelas: true,
                mataPelajaran: true,
                guru: true,
            },
        });
    }

    async create(dto: CreateJadwalPelajaranDto) {
        return this.prisma.jadwalPelajaran.create({
            data: dto,
            include: {
                kelas: true,
                mataPelajaran: true,
                guru: true,
            },
        });
    }

    async update(id: string, dto: UpdateJadwalPelajaranDto) {
        return this.prisma.jadwalPelajaran.update({
            where: { id },
            data: dto,
            include: {
                kelas: true,
                mataPelajaran: true,
                guru: true,
            },
        });
    }

    async remove(id: string) {
        return this.prisma.jadwalPelajaran.delete({
            where: { id },
        });
    }

    async generateTemplate() {
        const XLSX = require('xlsx');

        // Create sample data with proper headers
        const data = [
            {
                'Hari': 'SENIN',
                'Jam Mulai': '07:00',
                'Jam Selesai': '08:30',
                'Kelas': 'X IPA 1',
                'Mata Pelajaran': 'Matematika',
                'Guru': 'John Doe',
            },
            {
                'Hari': 'SELASA',
                'Jam Mulai': '08:30',
                'Jam Selesai': '10:00',
                'Kelas': 'XI IPS 2',
                'Mata Pelajaran': 'Bahasa Indonesia',
                'Guru': 'Jane Smith',
            },
        ];

        // Create workbook and worksheet
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Template Jadwal');

        // Set column widths
        ws['!cols'] = [
            { wch: 10 }, // Hari
            { wch: 12 }, // Jam Mulai
            { wch: 12 }, // Jam Selesai
            { wch: 15 }, // Kelas
            { wch: 25 }, // Mata Pelajaran
            { wch: 25 }, // Guru
        ];

        // Generate buffer
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        return buffer;
    }

    async exportToExcel() {
        const XLSX = require('xlsx');

        // Fetch all jadwal with relations
        const jadwalList = await this.prisma.jadwalPelajaran.findMany({
            include: {
                kelas: true,
                mataPelajaran: true,
                guru: true,
            },
            orderBy: [
                { hari: 'asc' },
                { jamMulai: 'asc' },
            ],
        });

        // Map to Excel format
        const data = jadwalList.map(j => ({
            'Hari': j.hari,
            'Jam Mulai': j.jamMulai,
            'Jam Selesai': j.jamSelesai,
            'Kelas': j.kelas.nama,
            'Mata Pelajaran': j.mataPelajaran.nama,
            'Guru': j.guru.nama,
        }));

        // Create workbook and worksheet
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Jadwal Pelajaran');

        // Set column widths
        ws['!cols'] = [
            { wch: 10 }, // Hari
            { wch: 12 }, // Jam Mulai
            { wch: 12 }, // Jam Selesai
            { wch: 15 }, // Kelas
            { wch: 25 }, // Mata Pelajaran
            { wch: 25 }, // Guru
        ];

        // Generate buffer
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        return buffer;
    }

    async importFromExcel(fileBuffer: Buffer) {
        const XLSX = require('xlsx');

        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data: any[] = XLSX.utils.sheet_to_json(worksheet);

        const results = {
            success: 0,
            failed: 0,
            errors: [] as any[],
        };

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNumber = i + 2; // Excel rows start at 1, header is row 1

            try {
                // Validate required fields
                if (!row['Hari'] || !row['Jam Mulai'] || !row['Jam Selesai'] ||
                    !row['Kelas'] || !row['Mata Pelajaran'] || !row['Guru']) {
                    throw new Error('Missing required fields');
                }

                // Validate hari enum
                const validHari = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
                if (!validHari.includes(row['Hari'])) {
                    throw new Error(`Invalid hari: ${row['Hari']}. Must be one of: ${validHari.join(', ')}`);
                }

                // Lookup kelas
                const kelas = await this.prisma.kelas.findFirst({
                    where: { nama: row['Kelas'] },
                });
                if (!kelas) {
                    throw new Error(`Kelas not found: ${row['Kelas']}`);
                }

                // Lookup mata pelajaran
                const mataPelajaran = await this.prisma.mataPelajaran.findFirst({
                    where: { nama: row['Mata Pelajaran'] },
                });
                if (!mataPelajaran) {
                    throw new Error(`Mata Pelajaran not found: ${row['Mata Pelajaran']}`);
                }

                // Lookup guru
                const guru = await this.prisma.guru.findFirst({
                    where: { nama: row['Guru'] },
                });
                if (!guru) {
                    throw new Error(`Guru not found: ${row['Guru']}`);
                }

                // Check for duplicate
                const existing = await this.prisma.jadwalPelajaran.findFirst({
                    where: {
                        hari: row['Hari'],
                        jamMulai: row['Jam Mulai'],
                        kelasId: kelas.id,
                    },
                });

                if (existing) {
                    // Update existing
                    await this.prisma.jadwalPelajaran.update({
                        where: { id: existing.id },
                        data: {
                            jamSelesai: row['Jam Selesai'],
                            mataPelajaranId: mataPelajaran.id,
                            guruId: guru.id,
                        },
                    });
                } else {
                    // Create new
                    await this.prisma.jadwalPelajaran.create({
                        data: {
                            hari: row['Hari'],
                            jamMulai: row['Jam Mulai'],
                            jamSelesai: row['Jam Selesai'],
                            kelasId: kelas.id,
                            mataPelajaranId: mataPelajaran.id,
                            guruId: guru.id,
                        },
                    });
                }

                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push({
                    row: rowNumber,
                    data: row,
                    error: error.message,
                });
            }
        }

        return results;
    }
}
