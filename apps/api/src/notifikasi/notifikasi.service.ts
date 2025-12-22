import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TipeNotifikasi } from '@prisma/client';

@Injectable()
export class NotifikasiService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, tipe: TipeNotifikasi, judul: string, pesan: string, linkUrl?: string, metadata?: any) {
        return this.prisma.notifikasi.create({
            data: { userId, tipe, judul, pesan, linkUrl, metadata },
        });
    }

    /**
     * Create bulk notifications (one by one to prevent race conditions)
     */
    async createBulk(notifications: Array<{ userId: string; tipe: TipeNotifikasi; judul: string; pesan: string; linkUrl?: string; metadata?: any }>) {
        const results: any[] = [];
        for (const notif of notifications) {
            try {
                const created = await this.prisma.notifikasi.create({
                    data: notif,
                });
                results.push(created);
            } catch (error) {
                console.error(`[Notification] Failed to create notification for user ${notif.userId}:`, error.message);
                // Continue with other notifications even if one fails
            }
        }
        console.log(`[Notification] ✅ Successfully created ${results.length}/${notifications.length} notifications`);
        return results;
    }

    async findAll(userId: string, isRead?: boolean) {
        console.log(`[Notification] findAll called with userId: ${userId}`);
        const results = await this.prisma.notifikasi.findMany({
            where: {
                userId,
                ...(isRead !== undefined && { isRead }),
            },
            orderBy: { createdAt: 'desc' },
        });
        console.log(`[Notification] findAll returned ${results.length} notifications for userId: ${userId}`);
        return results;
    }

    async getUnreadCount(userId: string) {
        return this.prisma.notifikasi.count({
            where: { userId, isRead: false },
        });
    }

    async markAsRead(id: string, userId: string) {
        return this.prisma.notifikasi.update({
            where: { id },
            data: { isRead: true, readAt: new Date() },
        });
    }

    async markAllAsRead(userId: string) {
        return this.prisma.notifikasi.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true, readAt: new Date() },
        });
    }

    async delete(id: string, userId: string) {
        return this.prisma.notifikasi.delete({
            where: { id, userId },
        });
    }

    // ============ Notification Triggers ============

    /**
     * Notify all students in a class about new tugas
     */
    async notifyTugasBaru(tugasId: string, kelasId: string | null, mataPelajaran: string, guruNama: string, deadline: Date) {
        console.log(`\n========================================`);
        console.log(`[Notification] notifyTugasBaru called`);
        console.log(`  tugasId: ${tugasId}`);
        console.log(`  kelasId: ${kelasId}`);
        console.log(`  mataPelajaran: ${mataPelajaran}`);
        console.log(`========================================\n`);

        // IMPORTANT: Only send notifications if kelasId is specified
        // If kelasId is null, it means "all classes" but we should NOT spam all students
        if (!kelasId) {
            console.log('[Notification] ❌ Skipping notification for tugas without specific class');
            return;
        }

        // Get all students in the specific class
        const siswaList = await this.prisma.siswa.findMany({
            where: { kelasId },
            select: { id: true },
        });

        console.log(`[Notification] Found ${siswaList.length} students in class ${kelasId}`);

        if (siswaList.length === 0) {
            console.log('[Notification] ❌ No students found in class', kelasId);
            return;
        }


        // Check for existing notifications to prevent duplicates
        // Use judul (title) as unique identifier since metadata JSON queries don't work reliably in Prisma
        const notificationTitle = `Tugas Baru: ${mataPelajaran}`;

        const existingNotifications = await this.prisma.notifikasi.findMany({
            where: {
                userId: { in: siswaList.map(s => s.id) },
                tipe: 'TUGAS_BARU',
                judul: notificationTitle,
            },
            select: {
                userId: true,
            },
        });

        console.log(`[Notification] Found ${existingNotifications.length} existing notifications with title "${notificationTitle}"`);

        const existingUserIds = new Set(existingNotifications.map(n => n.userId));

        console.log(`[Notification] ${existingUserIds.size} users already have notification for this tugas`);

        // Filter out students who already have notification for this tugas
        const siswaToNotify = siswaList.filter(s => !existingUserIds.has(s.id));

        if (siswaToNotify.length === 0) {
            console.log(`[Notification] ✅ All students already have notification - SKIPPING`);
            return;
        }

        console.log(`[Notification] 📨 Creating ${siswaToNotify.length} NEW notifications`);
        console.log(`  Already exist: ${existingUserIds.size}`);
        console.log(`  Will create: ${siswaToNotify.length}`);
        console.log(`  User IDs to notify:`, siswaToNotify.map(s => s.id));

        const notifications = siswaToNotify.map(siswa => ({
            userId: siswa.id,
            tipe: 'TUGAS_BARU' as TipeNotifikasi,
            judul: `Tugas Baru: ${mataPelajaran}`,
            pesan: `${guruNama} memberi tugas baru dengan deadline ${new Date(deadline).toLocaleDateString('id-ID')}`,
            linkUrl: '/tugas',
            metadata: { tugasId },
        }));

        console.log(`[Notification] Creating notifications:`);
        notifications.forEach((n, i) => {
            console.log(`  ${i + 1}. userId: ${n.userId}, title: "${n.judul}"`);
        });

        return this.createBulk(notifications);
    }

    /**
     * Notify guru about new tugas submission
     */
    async notifyTugasDikumpulkan(tugasId: string, guruId: string, siswaNama: string, tugasJudul: string) {
        return this.create(
            guruId,
            'TUGAS_DINILAI' as TipeNotifikasi, // Using TUGAS_DINILAI as closest match
            'Pengumpulan Tugas Baru',
            `${siswaNama} telah mengumpulkan tugas "${tugasJudul}"`,
            '/tugas-management',
            { tugasId }
        );
    }

    /**
     * Notify student about graded tugas
     */
    async notifyTugasDinilai(tugasId: string, siswaId: string, tugasJudul: string, score: number, maxScore: number) {
        return this.create(
            siswaId,
            'TUGAS_DINILAI' as TipeNotifikasi,
            'Tugas Telah Dinilai',
            `Tugas "${tugasJudul}" telah dinilai. Nilai Anda: ${score}/${maxScore}`,
            '/tugas',
            { tugasId, score }
        );
    }

    /**
     * Notify students about new ujian
     */
    async notifyUjianBaru(ujianId: string, kelasIds: string[], ujianNama: string, tanggalMulai: Date) {
        // Get all students in the selected classes
        const siswaList = await this.prisma.siswa.findMany({
            where: { kelasId: { in: kelasIds } },
            select: { id: true },
        });

        if (siswaList.length === 0) return;

        const notifications = siswaList.map(siswa => ({
            userId: siswa.id,
            tipe: 'SISTEM' as TipeNotifikasi, // Using SISTEM for ujian
            judul: `Ujian Baru: ${ujianNama}`,
            pesan: `Ujian "${ujianNama}" akan dimulai pada ${new Date(tanggalMulai).toLocaleString('id-ID')}`,
            linkUrl: '/ujian-saya',
            metadata: { ujianId },
        }));

        return this.createBulk(notifications);
    }

    /**
     * Notify students about new materi
     */
    async notifyMateriBaru(materiId: string, kelasId: string | null, materiJudul: string, mataPelajaran: string, guruNama: string) {
        // Get all students in the class
        const siswaList = kelasId
            ? await this.prisma.siswa.findMany({
                where: { kelasId },
                select: { id: true },
            })
            : await this.prisma.siswa.findMany({
                select: { id: true },
            });

        if (siswaList.length === 0) return;

        const notifications = siswaList.map(siswa => ({
            userId: siswa.id,
            tipe: 'MATERI_BARU' as TipeNotifikasi,
            judul: 'Materi Baru Tersedia',
            pesan: `${guruNama} mengunggah materi "${materiJudul}" untuk ${mataPelajaran}`,
            linkUrl: '/materi',
            metadata: { materiId },
        }));

        return this.createBulk(notifications);
    }

    /**
     * Send deadline reminders for tugas
     */
    async sendDeadlineReminders() {
        const now = new Date();
        const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        const oneDayLater = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        // Find tugas with upcoming deadlines
        const tugasList = await this.prisma.tugas.findMany({
            where: {
                isPublished: true,
                deadline: {
                    gte: now,
                    lte: threeDaysLater,
                },
                deletedAt: null,
            },
            include: {
                mataPelajaran: true,
                kelas: {
                    include: {
                        siswa: true,
                    },
                },
                submissions: {
                    where: {
                        status: { in: ['DIKUMPULKAN', 'DINILAI', 'TERLAMBAT'] },
                    },
                    select: { siswaId: true },
                },
            },
        });

        const notifications: any[] = [];

        for (const tugas of tugasList) {
            const deadline = new Date(tugas.deadline);
            const deadlineDiff = Math.ceil((deadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

            // Skip if not H-3, H-1, or H-0
            if (deadlineDiff !== 3 && deadlineDiff !== 1 && deadlineDiff !== 0) continue;

            // Get students who haven't submitted
            const submittedIds = new Set(tugas.submissions.map(s => s.siswaId));
            const siswaList = tugas.kelas?.siswa || [];
            const unsubmittedSiswa = siswaList.filter(s => !submittedIds.has(s.id));

            let message = '';
            if (deadlineDiff === 3) {
                message = `Tugas "${tugas.judul}" akan deadline dalam 3 hari (${deadline.toLocaleDateString('id-ID')})`;
            } else if (deadlineDiff === 1) {
                message = `Tugas "${tugas.judul}" akan deadline besok! (${deadline.toLocaleDateString('id-ID')})`;
            } else {
                message = `Tugas "${tugas.judul}" deadline hari ini! (${deadline.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})`;
            }

            for (const siswa of unsubmittedSiswa) {
                notifications.push({
                    userId: siswa.id,
                    tipe: 'DEADLINE_REMINDER' as TipeNotifikasi,
                    judul: 'Reminder Deadline',
                    pesan: message,
                    linkUrl: '/tugas',
                    metadata: { tugasId: tugas.id, deadlineDays: deadlineDiff },
                });
            }
        }

        if (notifications.length > 0) {
            await this.createBulk(notifications);
            console.log(`Sent ${notifications.length} deadline reminder notifications`);
        }

        return { sent: notifications.length };
    }
}
