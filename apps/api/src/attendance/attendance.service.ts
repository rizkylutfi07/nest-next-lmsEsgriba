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
        const jakartaTime = new Date(now.getTime() + this.JAKARTA_OFFSET_MS);
        return jakartaTime;
    }

    // Helper method to get today's date in Jakarta timezone (stored as UTC)
    // We set time to NOON (12:00) Jakarta time to be safe from offsets
    // When DB subtracts 7h, it becomes 05:00 UTC, which is still the same day
    private getTodayJakarta(): Date {
        const jakartaTime = this.getJakartaTime();
        const year = jakartaTime.getUTCFullYear();
        const month = jakartaTime.getUTCMonth();
        const day = jakartaTime.getUTCDate();

        // Return Dec 16 18:00:00 (Fake UTC) -> Becomes Dec 16 11:00:00 Real UTC in DB (if -7h)
        // Even if offset is -12h, it becomes Dec 16 06:00:00.
        // This extreme buffer ensures we stay on the same day.
        // Return Dec 16 18:00:00 (Fake UTC) -> Becomes Dec 16 11:00:00 Real UTC in DB (if -7h)
        // Even if offset is -12h, it becomes Dec 16 06:00:00.
        // This extreme buffer ensures we stay on the same day.
        const today = new Date(Date.UTC(year, month, day, 18, 0, 0, 0));
        return today;
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

        // Check if already checked in today
        const jakartaTime = this.getJakartaTime(); // Use this for checks
        const today = this.getTodayJakarta();     // use this for DB 'tanggal'

        const existing = await this.prisma.attendance.findFirst({
            where: {
                siswaId: siswa.id,
                tanggal: today,
                deletedAt: null,
            },
        });

        if (existing) {
            // Need to reconstruct the time for display
            // stored jamMasuk is Real UTC. We need Jakarta Time.
            // Since we know the offset is constant +7h
            const storedTime = new Date(existing.jamMasuk);
            const displayTime = new Date(storedTime.getTime() + this.JAKARTA_OFFSET_MS);

            throw new BadRequestException(`${siswa.nama} sudah melakukan absensi hari ini pada ${displayTime.toLocaleTimeString('id-ID')}`);
        }

        // Get late time threshold from settings
        const lateTimeThreshold = await this.settingsService.getLateTimeThreshold();
        const [hours, minutes] = lateTimeThreshold.split(':').map(Number);

        // Determine status based on time
        const lateTime = new Date(jakartaTime);
        lateTime.setHours(hours, minutes, 0, 0);

        const status = jakartaTime > lateTime ? AttendanceStatus.TERLAMBAT : AttendanceStatus.HADIR;

        // Create attendance record
        // Revert to Real UTC (new Date) to fix double-shifting
        const attendance = await this.prisma.attendance.create({
            data: {
                siswaId: siswa.id,
                tanggal: today,
                // Revert to Real UTC
                jamMasuk: new Date(),
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

        // Format jamMasuk to WIB string for consistent frontend display
        // Stored is UTC. WIB is UTC+7.
        // We use the same formatting logic as the report page.
        // attendance.jamMasuk is Real UTC.
        const wibTime = new Date(attendance.jamMasuk.getTime() + (7 * 60 * 60 * 1000));
        const h = String(wibTime.getUTCHours()).padStart(2, '0');
        const m = String(wibTime.getUTCMinutes()).padStart(2, '0');
        const s = String(wibTime.getUTCSeconds()).padStart(2, '0');
        const jamMasukStr = `${h}:${m}:${s}`;

        return {
            message: `Absensi berhasil untuk ${siswa.nama}`,
            attendance,
            siswa: {
                nisn: siswa.nisn,
                nama: siswa.nama,
                kelas: siswa.kelas?.nama,
            },
            status,
            jamMasuk: jamMasukStr, // Return string instead of Date object
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
                // Reverting to new Date() (Real UTC) because DB seems to correct timestamps properly
                // The previous issue of '04:40' (next day) implies we were double-adding.
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

        console.log('DEBUG CHECKIN:', {
            todayJakarta: today.toISOString(),
            jamMasukJakarta: attendance.jamMasuk.toISOString(),
            savedTanggal: attendance.tanggal.toISOString()
        });

        return attendance;

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
            data: {
                jamKeluar: new Date(), // Revert to Real UTC
            },
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
        // Use 18:00 UTC to match storage format
        const targetDate = new Date(Date.UTC(year, month - 1, day, 18, 0, 0, 0));

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
        // AND format times to HH:mm:ss (WIB) to prevent browser timezone issues
        const formattedAttendance = attendance.map(att => {
            const d = att.tanggal;
            const year = d.getUTCFullYear();
            const month = String(d.getUTCMonth() + 1).padStart(2, '0');
            const day = String(d.getUTCDate()).padStart(2, '0');

            // Format jamMasuk to WIB (UTC+7)
            let jamMasukStr = '-';
            if (att.jamMasuk) {
                // Add 7 hours to get WIB
                const wibTime = new Date(att.jamMasuk.getTime() + (7 * 60 * 60 * 1000));
                const h = String(wibTime.getUTCHours()).padStart(2, '0');
                const m = String(wibTime.getUTCMinutes()).padStart(2, '0');
                const s = String(wibTime.getUTCSeconds()).padStart(2, '0');
                jamMasukStr = `${h}:${m}:${s}`;
            }

            // Format jamKeluar to WIB (UTC+7)
            let jamKeluarStr = '-';
            if (att.jamKeluar) {
                // Add 7 hours to get WIB
                const wibTime = new Date(att.jamKeluar.getTime() + (7 * 60 * 60 * 1000));
                const h = String(wibTime.getUTCHours()).padStart(2, '0');
                const m = String(wibTime.getUTCMinutes()).padStart(2, '0');
                const s = String(wibTime.getUTCSeconds()).padStart(2, '0');
                jamKeluarStr = `${h}:${m}:${s}`;
            }

            return {
                ...att,
                tanggal: `${year}-${month}-${day}`,
                jamMasuk: jamMasukStr,
                jamKeluar: jamKeluarStr,
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
            // Must use 18:00 UTC to match storage format
            targetDate = new Date(Date.UTC(year, month - 1, day, 18, 0, 0, 0));
        } else {
            targetDate = this.getTodayJakarta();
        }

        console.log("DEBUG MANUAL QUERY:", {
            queryDate: query.date,
            targetDate: targetDate.toISOString()
        });

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
        const result = students.map(student => {
            let att = student.attendance[0] || null;
            if (att) {
                // Format times to WIB strings manually
                let jamMasukStr: string | null = null;
                if (att.jamMasuk) {
                    const wibTime = new Date(att.jamMasuk.getTime() + (7 * 60 * 60 * 1000));
                    const h = String(wibTime.getUTCHours()).padStart(2, '0');
                    const m = String(wibTime.getUTCMinutes()).padStart(2, '0');
                    const s = String(wibTime.getUTCSeconds()).padStart(2, '0');
                    jamMasukStr = `${h}:${m}:${s}`;
                }

                let jamKeluarStr: string | null = null;
                if (att.jamKeluar) {
                    const wibTime = new Date(att.jamKeluar.getTime() + (7 * 60 * 60 * 1000));
                    const h = String(wibTime.getUTCHours()).padStart(2, '0');
                    const m = String(wibTime.getUTCMinutes()).padStart(2, '0');
                    const s = String(wibTime.getUTCSeconds()).padStart(2, '0');
                    jamKeluarStr = `${h}:${m}:${s}`;
                }

                att = {
                    ...att,
                    jamMasuk: jamMasukStr as any, // Cast to any to bypass type check temporarily
                    jamKeluar: jamKeluarStr as any,
                };
            }

            return {
                id: student.id,
                nisn: student.nisn,
                nama: student.nama,
                kelas: student.kelas,
                attendance: att, // This now has string timestamps
            };
        });

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
        // Parse date string without timezone conversion
        const [year, month, day] = dto.tanggal.split('-').map(Number);

        // Use 18:00 offset logic for Manual Attendance dates as well
        // calculated as UTC to survive negative shifts
        const targetDate = new Date(Date.UTC(year, month - 1, day, 18, 0, 0, 0));

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
                    jamKeluar: new Date(), // Revert to Real UTC
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
                tanggal: targetDate, // Uses 18:00 offset
                jamMasuk: new Date(), // Revert to Real UTC
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
