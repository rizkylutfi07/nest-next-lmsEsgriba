import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';
import { AttendanceStatus } from '@prisma/client';
import { ScanBarcodeDto, CheckInDto, CheckOutDto, AttendanceQueryDto, UpdateAttendanceDto, ManualAttendanceDto, ManualAttendanceQueryDto } from './dto';

@Injectable()
export class AttendanceService {
    constructor(
        private prisma: PrismaService,
        private settingsService: SettingsService,
    ) { }

    // Jakarta timezone offset in milliseconds (UTC+7)
    private readonly JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000;

    // Helper method to get current time adjusted to Jakarta timezone
    private getJakartaTime(): Date {
        const now = new Date();
        // Add 7 hours to UTC to get Jakarta time
        return new Date(now.getTime() + this.JAKARTA_OFFSET_MS);
    }

    // Helper method to get today's date in Jakarta timezone (stored as UTC midnight)
    private getTodayJakarta(): Date {
        const jakartaTime = this.getJakartaTime();
        // Get Jakarta date components
        const year = jakartaTime.getUTCFullYear();
        const month = jakartaTime.getUTCMonth();
        const day = jakartaTime.getUTCDate();
        // Store Jakarta date as UTC midnight
        // PostgreSQL DATE type will truncate time anyway
        return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    }

    async scanBarcode(dto: ScanBarcodeDto, userId: string) {
        // Find student by NISN
        const siswa = await this.prisma.siswa.findUnique({
            where: { nisn: dto.nisn, deletedAt: null },
            include: { kelas: true },
        });

        if (!siswa) {
            throw new NotFoundException(`Siswa dengan NISN ${dto.nisn} tidak ditemukan`);
        }

        // Check if already checked in today (using Indonesia timezone)
        const jakartaTime = this.getJakartaTime();
        const today = this.getTodayJakarta();

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

        // Get late time threshold from settings
        const lateTimeThreshold = await this.settingsService.getLateTimeThreshold();
        const [hours, minutes] = lateTimeThreshold.split(':').map(Number);

        // Determine status based on time
        const lateTime = new Date(jakartaTime);
        lateTime.setHours(hours, minutes, 0, 0);

        const status = jakartaTime > lateTime ? AttendanceStatus.TERLAMBAT : AttendanceStatus.HADIR;

        // Create attendance record
        const attendance = await this.prisma.attendance.create({
            data: {
                siswaId: siswa.id,
                tanggal: today,
                jamMasuk: jakartaTime,
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
            jamMasuk: jakartaTime,
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

        const today = this.getTodayJakarta();

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
                jamMasuk: this.getJakartaTime(),
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
        // Find student by NISN
        const siswa = await this.prisma.siswa.findUnique({
            where: { nisn: dto.siswaId, deletedAt: null },
            include: { kelas: true },
        });

        if (!siswa) {
            throw new NotFoundException('Siswa tidak ditemukan');
        }

        const today = this.getTodayJakarta();

        const attendance = await this.prisma.attendance.findFirst({
            where: {
                siswaId: siswa.id,
                tanggal: today,
                deletedAt: null,
            },
        });

        if (!attendance) {
            throw new NotFoundException('Absensi hari ini tidak ditemukan. Siswa belum check-in.');
        }

        if (attendance.jamKeluar) {
            throw new BadRequestException(`Sudah melakukan check-out pada ${attendance.jamKeluar.toLocaleTimeString('id-ID')}`);
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
        const today = this.getTodayJakarta();

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

        // Calculate statistics by status
        const stats = {
            hadir: attendance.filter(a => a.status === AttendanceStatus.HADIR).length,
            sakit: attendance.filter(a => a.status === AttendanceStatus.SAKIT).length,
            izin: attendance.filter(a => a.status === AttendanceStatus.IZIN).length,
            alpha: attendance.filter(a => a.status === AttendanceStatus.ALPHA).length,
            terlambat: attendance.filter(a => a.status === AttendanceStatus.TERLAMBAT).length,
        };

        return {
            tanggal: today,
            totalSiswa,
            totalHadir: attendance.length,
            totalAlpha: totalSiswa - attendance.length,
            stats,
            attendance,
        };
    }

    async getAbsentStudents() {
        const today = this.getTodayJakarta();

        // Get all active students
        const allStudents = await this.prisma.siswa.findMany({
            where: {
                deletedAt: null,
                status: 'AKTIF',
            },
            include: {
                kelas: true,
            },
            orderBy: [
                { kelas: { nama: 'asc' } },
                { nama: 'asc' },
            ],
        });

        // Get students who have attended today
        const attendedStudents = await this.prisma.attendance.findMany({
            where: {
                tanggal: today,
                deletedAt: null,
            },
            select: {
                siswaId: true,
            },
        });

        const attendedStudentIds = new Set(attendedStudents.map(a => a.siswaId));

        // Filter out students who have attended
        const absentStudents = allStudents.filter(
            student => !attendedStudentIds.has(student.id)
        );

        return {
            tanggal: today,
            total: absentStudents.length,
            students: absentStudents,
        };
    }

    async getAttendanceByDate(date: string) {
        // Parse date string without timezone conversion
        const [year, month, day] = date.split('-').map(Number);
        const targetDate = new Date(year, month - 1, day, 0, 0, 0, 0);

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

        // Transform attendance data to format tanggal as string (YYYY-MM-DD)
        // Date is stored as Jakarta date at UTC midnight, so just extract UTC components
        const formattedAttendance = attendance.map(att => {
            const d = att.tanggal;
            const year = d.getUTCFullYear();
            const month = String(d.getUTCMonth() + 1).padStart(2, '0');
            const day = String(d.getUTCDate()).padStart(2, '0');
            return {
                ...att,
                tanggal: `${year}-${month}-${day}`,
            };
        });

        return {
            stats,
            attendance: formattedAttendance,
        };
    }

    // Manual Attendance Methods
    async getStudentsForManualAttendance(query: ManualAttendanceQueryDto) {
        let targetDate: Date;

        if (query.date) {
            // Parse date string without timezone conversion
            const [year, month, day] = query.date.split('-').map(Number);
            targetDate = new Date(year, month - 1, day, 0, 0, 0, 0);
        } else {
            targetDate = this.getTodayJakarta();
        }

        const where: any = {
            deletedAt: null,
            status: 'AKTIF',
        };

        if (query.kelasId) {
            where.kelasId = query.kelasId;
        }

        // Get all active students
        const students = await this.prisma.siswa.findMany({
            where,
            include: {
                kelas: true,
                attendance: {
                    where: {
                        tanggal: targetDate,
                        deletedAt: null,
                    },
                },
            },
            orderBy: [
                { kelas: { nama: 'asc' } },
                { nama: 'asc' },
            ],
        });

        // Map students with their attendance status
        const result = students.map(student => ({
            id: student.id,
            nisn: student.nisn,
            nama: student.nama,
            kelas: student.kelas,
            attendance: student.attendance[0] || null,
        }));

        // Calculate stats
        const stats = {
            total: result.length,
            hadir: result.filter(s => s.attendance?.status === AttendanceStatus.HADIR).length,
            sakit: result.filter(s => s.attendance?.status === AttendanceStatus.SAKIT).length,
            izin: result.filter(s => s.attendance?.status === AttendanceStatus.IZIN).length,
            alpha: result.filter(s => s.attendance?.status === AttendanceStatus.ALPHA).length,
            terlambat: result.filter(s => s.attendance?.status === AttendanceStatus.TERLAMBAT).length,
            belum: result.filter(s => !s.attendance).length,
        };

        return {
            tanggal: targetDate,
            stats,
            students: result,
        };
    }

    async updateAttendanceStatus(id: string, dto: UpdateAttendanceDto, userId: string) {
        const attendance = await this.prisma.attendance.findUnique({
            where: { id },
            include: {
                siswa: {
                    include: { kelas: true },
                },
            },
        });

        if (!attendance) {
            throw new NotFoundException('Attendance record not found');
        }

        if (attendance.deletedAt) {
            throw new BadRequestException('Attendance record has been deleted');
        }

        return this.prisma.attendance.update({
            where: { id },
            data: {
                status: dto.status,
                keterangan: dto.keterangan,
                scanBy: userId,
            },
            include: {
                siswa: {
                    include: { kelas: true },
                },
            },
        });
    }

    async createManualAttendance(dto: ManualAttendanceDto, userId: string) {
        const siswa = await this.prisma.siswa.findUnique({
            where: { id: dto.siswaId, deletedAt: null },
            include: { kelas: true },
        });

        if (!siswa) {
            throw new NotFoundException('Siswa tidak ditemukan');
        }

        // Parse date string without timezone conversion
        const [year, month, day] = dto.tanggal.split('-').map(Number);
        const targetDate = new Date(year, month - 1, day, 0, 0, 0, 0);

        // Check if attendance already exists
        const existing = await this.prisma.attendance.findFirst({
            where: {
                siswaId: dto.siswaId,
                tanggal: targetDate,
                deletedAt: null,
            },
        });

        if (existing) {
            // Update existing record
            return this.prisma.attendance.update({
                where: { id: existing.id },
                data: {
                    status: dto.status,
                    keterangan: dto.keterangan,
                    scanBy: userId,
                },
                include: {
                    siswa: {
                        include: { kelas: true },
                    },
                },
            });
        }

        // Create new record
        return this.prisma.attendance.create({
            data: {
                siswaId: dto.siswaId,
                tanggal: targetDate,
                jamMasuk: this.getJakartaTime(),
                status: dto.status,
                keterangan: dto.keterangan,
                scanBy: userId,
            },
            include: {
                siswa: {
                    include: { kelas: true },
                },
            },
        });
    }
}
