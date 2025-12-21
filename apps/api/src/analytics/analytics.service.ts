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
}
