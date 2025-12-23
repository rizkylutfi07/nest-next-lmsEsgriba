import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    async getStudentDashboard(siswaId: string) {
        const [materiCount, tugasStats, forumCount, progressData] = await Promise.all([
            this.prisma.materiBookmark.count({ where: { siswaId } }),
            this.getTugasStats(siswaId),
            this.getForumStats(siswaId),
            this.getProgressBySubject(siswaId),
        ]);

        return {
            materi: { bookmarked: materiCount },
            tugas: tugasStats,
            forum: forumCount,
            progress: progressData,
        };
    }

    private async getTugasStats(siswaId: string) {
        const [total, submitted, graded] = await Promise.all([
            this.prisma.tugasSiswa.count({ where: { siswaId } }),
            this.prisma.tugasSiswa.count({ where: { siswaId, status: { in: ['DIKUMPULKAN', 'DINILAI'] } } }),
            this.prisma.tugasSiswa.count({ where: { siswaId, status: 'DINILAI' } }),
        ]);

        const avgScore = await this.prisma.tugasSiswa.aggregate({
            where: { siswaId, score: { not: null } },
            _avg: { score: true },
        });

        return { total, submitted, graded, avgScore: avgScore._avg.score || 0 };
    }

    private async getForumStats(siswaId: string) {
        // Count forum posts by student (assuming siswaId maps to userId)
        const postsCount = await this.prisma.forumPost.count({
            where: { authorId: siswaId, deletedAt: null },
        });

        return { postsCount };
    }

    private async getProgressBySubject(siswaId: string) {
        return this.prisma.progressSiswa.findMany({
            where: { siswaId },
            include: {
                mataPelajaran: { select: { nama: true } },
            },
        });
    }

    async getUpcomingTasks(siswaId: string) {
        // Get assigned tugas with approaching deadlines
        const upcoming = await this.prisma.tugas.findMany({
            where: {
                isPublished: true,
                deadline: { gte: new Date() },
                deletedAt: null,
            },
            include: {
                mataPelajaran: { select: { nama: true } },
                submissions: { where: { siswaId } },
            },
            orderBy: { deadline: 'asc' },
            take: 10,
        });

        return upcoming;
    }

    async getAdminDashboard() {
        const [
            siswaCount,
            guruCount,
            kelasCount,
            mapelCount,
            activeExams,
            totalSoal,
            totalUjian,
            totalPaketSoal,
            tugasDikumpulkan,
            tugasDinilai,
            tahunAjaranAktif,
        ] = await Promise.all([
            this.prisma.siswa.count({ where: { status: 'AKTIF' } }),
            this.prisma.guru.count({ where: { status: 'AKTIF' } }),
            this.prisma.kelas.count({ where: { deletedAt: null } }),
            this.prisma.mataPelajaran.count({ where: { deletedAt: null } }),
            this.prisma.ujian.count({
                where: {
                    status: 'ONGOING',
                    tanggalMulai: { lte: new Date() },
                    tanggalSelesai: { gte: new Date() },
                }
            }),
            // CBT Stats
            this.prisma.bankSoal.count({ where: { deletedAt: null } }),
            this.prisma.ujian.count({ where: { deletedAt: null } }),
            this.prisma.paketSoal.count({ where: { deletedAt: null } }),
            this.prisma.tugasSiswa.count({ where: { status: 'DIKUMPULKAN' } }),
            this.prisma.tugasSiswa.count({ where: { status: 'DINILAI' } }),
            // Tahun Ajaran Aktif
            this.prisma.tahunAjaran.findFirst({
                where: { status: 'AKTIF' },
                select: { tahun: true },
            }),
        ]);

        return {
            siswaCount,
            guruCount,
            kelasCount,
            mapelCount,
            activeExams,
            // CBT Stats
            totalSoal,
            totalUjian,
            totalPaketSoal,
            tugasDikumpulkan,
            tugasDinilai,
            // Tahun Ajaran
            tahunAjaranAktif: tahunAjaranAktif?.tahun || 'N/A',
        };
    }

    async getGuruDashboard(guruId: string) {

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        // Map day number 0-6 (Sun-Sat) to Hari enum
        const dayNames = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
        const today = dayNames[now.getDay()];

        const [dbSchedule, totalClasses, totalStudents, tasksToGrade] = await Promise.all([
            // Get today's schedule
            today !== 'MINGGU' ? this.prisma.jadwalPelajaran.findMany({
                where: {
                    guruId,
                    hari: today as any, // Cast to Hari enum
                },
                include: {
                    kelas: { select: { nama: true } },
                    mataPelajaran: { select: { nama: true } },
                },
                orderBy: { jamMulai: 'asc' },
            }) : [],
            // Count classes taught by this teacher (via MataPelajaran or directly assigned?)
            // A simplified approach: count unique classes in JadwalPelajaran for this teacher
            this.prisma.jadwalPelajaran.findMany({
                where: { guruId },
                select: { kelasId: true },
                distinct: ['kelasId'], // This ensures unique classes
            }).then(res => res.length),
            // Count total students in those classes (approximate reach)
            this.prisma.kelas.aggregate({
                where: {
                    jadwalPelajaran: { some: { guruId } }
                },
                _sum: {
                    kapasitas: true // Using capacity as proxy or actual student count if possible
                }
            }).then(res => res._sum.kapasitas || 0), // Fallback if no capacity set, but ideally should query real students
            // Count tasks needing grading
            this.prisma.tugasSiswa.count({
                where: {
                    tugas: { guruId },
                    status: 'DIKUMPULKAN',
                }
            })
        ]);

        // Re-calculate total students accurately by counting actual students in taught classes
        const taughtClassIds = await this.prisma.jadwalPelajaran.findMany({
            where: { guruId },
            select: { kelasId: true },
            distinct: ['kelasId'],
        });

        const realStudentCount = await this.prisma.siswa.count({
            where: {
                kelasId: { in: taughtClassIds.map(c => c.kelasId) },
                status: 'AKTIF',
            }
        });

        return {
            todaySchedule: dbSchedule.map(s => ({
                id: s.id,
                time: `${s.jamMulai} - ${s.jamSelesai}`,
                className: s.kelas.nama,
                subject: s.mataPelajaran.nama,
                room: 'Ruang Kelas', // Default for now unless added to schema
            })),
            stats: {
                totalClasses,
                totalStudents: realStudentCount,
                tasksToGrade,
            }
        };
    }
}
