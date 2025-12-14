import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus } from '@prisma/client';
import { ScanBarcodeDto, CheckInDto, CheckOutDto, AttendanceQueryDto } from './dto';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }

    async scanBarcode(dto: ScanBarcodeDto, userId: string) {
        // Find student by NISN
        const siswa = await this.prisma.siswa.findUnique({
            where: { nisn: dto.nisn, deletedAt: null },
            include: { kelas: true },
        });

        if (!siswa) {
            throw new NotFoundException(`Siswa dengan NISN ${dto.nisn} tidak ditemukan`);
        }

        // Check if already checked in today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await this.prisma.attendance.findFirst({
            where: {
                siswaId: siswa.id,
                tanggal: today,
                deletedAt: null,
            },
        });

        if (existing) {
            throw new BadRequestException(`${siswa.nama} sudah melakukan absensi hari ini pada ${existing.jamMasuk.toLocaleTimeString('id-ID')}`);
        }

        // Determine status based on time
        const now = new Date();
        const lateTime = new Date();
        lateTime.setHours(7, 30, 0, 0); // 07:30 AM

        const status = now > lateTime ? AttendanceStatus.TERLAMBAT : AttendanceStatus.HADIR;

        // Create attendance record
        const attendance = await this.prisma.attendance.create({
            data: {
                siswaId: siswa.id,
                tanggal: today,
                jamMasuk: now,
                status,
                keterangan: dto.keterangan,
                scanBy: userId,
            },
            include: {
                siswa: {
                    include: { kelas: true },
                },
            },
        });

        return {
            message: `Absensi berhasil untuk ${siswa.nama}`,
            attendance,
            siswa: {
                nisn: siswa.nisn,
                nama: siswa.nama,
                kelas: siswa.kelas?.nama,
            },
            status,
            jamMasuk: now,
        };
    }

    async checkIn(dto: CheckInDto, userId: string) {
        const siswa = await this.prisma.siswa.findUnique({
            where: { id: dto.siswaId, deletedAt: null },
            include: { kelas: true },
        });

        if (!siswa) {
            throw new NotFoundException('Siswa tidak ditemukan');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await this.prisma.attendance.findFirst({
            where: {
                siswaId: dto.siswaId,
                tanggal: today,
                deletedAt: null,
            },
        });

        if (existing) {
            throw new BadRequestException('Siswa sudah melakukan absensi hari ini');
        }

        const attendance = await this.prisma.attendance.create({
            data: {
                siswaId: dto.siswaId,
                tanggal: today,
                jamMasuk: new Date(),
                status: dto.status || AttendanceStatus.HADIR,
                keterangan: dto.keterangan,
                scanBy: userId,
            },
            include: {
                siswa: {
                    include: { kelas: true },
                },
            },
        });

        return attendance;
    }

    async checkOut(dto: CheckOutDto) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await this.prisma.attendance.findFirst({
            where: {
                siswaId: dto.siswaId,
                tanggal: today,
                deletedAt: null,
            },
        });

        if (!attendance) {
            throw new NotFoundException('Absensi hari ini tidak ditemukan');
        }

        if (attendance.jamKeluar) {
            throw new BadRequestException('Sudah melakukan check-out');
        }

        return this.prisma.attendance.update({
            where: { id: attendance.id },
            data: { jamKeluar: new Date() },
            include: {
                siswa: {
                    include: { kelas: true },
                },
            },
        });
    }

    async getTodayAttendance() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await this.prisma.attendance.findMany({
            where: {
                tanggal: today,
                deletedAt: null,
            },
            include: {
                siswa: {
                    include: { kelas: true },
                },
            },
            orderBy: { jamMasuk: 'asc' },
        });

        const totalSiswa = await this.prisma.siswa.count({
            where: { deletedAt: null, status: 'AKTIF' },
        });

        return {
            tanggal: today,
            totalSiswa,
            totalHadir: attendance.length,
            totalAlpha: totalSiswa - attendance.length,
            attendance,
        };
    }

    async getAttendanceByDate(date: string) {
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const attendance = await this.prisma.attendance.findMany({
            where: {
                tanggal: targetDate,
                deletedAt: null,
            },
            include: {
                siswa: {
                    include: { kelas: true },
                },
            },
            orderBy: { jamMasuk: 'asc' },
        });

        return attendance;
    }

    async getStudentAttendance(siswaId: string, query: AttendanceQueryDto) {
        const where: any = {
            siswaId,
            deletedAt: null,
        };

        if (query.startDate) {
            where.tanggal = { gte: new Date(query.startDate) };
        }

        if (query.endDate) {
            where.tanggal = { ...where.tanggal, lte: new Date(query.endDate) };
        }

        if (query.status) {
            where.status = query.status;
        }

        const attendance = await this.prisma.attendance.findMany({
            where,
            orderBy: { tanggal: 'desc' },
            include: {
                siswa: {
                    include: { kelas: true },
                },
            },
        });

        return attendance;
    }

    async generateAttendanceReport(query: AttendanceQueryDto) {
        const where: any = {
            deletedAt: null,
        };

        if (query.startDate) {
            where.tanggal = { gte: new Date(query.startDate) };
        }

        if (query.endDate) {
            where.tanggal = { ...where.tanggal, lte: new Date(query.endDate) };
        }

        if (query.kelasId) {
            where.siswa = { kelasId: query.kelasId };
        }

        if (query.status) {
            where.status = query.status;
        }

        const attendance = await this.prisma.attendance.findMany({
            where,
            include: {
                siswa: {
                    include: { kelas: true },
                },
            },
            orderBy: [{ tanggal: 'desc' }, { jamMasuk: 'asc' }],
        });

        // Calculate statistics
        const stats = {
            total: attendance.length,
            hadir: attendance.filter(a => a.status === AttendanceStatus.HADIR).length,
            terlambat: attendance.filter(a => a.status === AttendanceStatus.TERLAMBAT).length,
            izin: attendance.filter(a => a.status === AttendanceStatus.IZIN).length,
            sakit: attendance.filter(a => a.status === AttendanceStatus.SAKIT).length,
            alpha: attendance.filter(a => a.status === AttendanceStatus.ALPHA).length,
        };

        return {
            stats,
            attendance,
        };
    }
}
