import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartUjianDto } from './dto/start-ujian.dto';
import { SubmitJawabanDto } from './dto/submit-jawaban.dto';
import { LogActivityDto } from './dto/log-activity.dto';
import { StatusUjian, StatusPengerjaan, TipeSoal } from '@prisma/client';

@Injectable()
export class UjianSiswaService {
    private activityLogs: Map<string, any[]> = new Map(); // In-memory storage for activity logs
    private readonly MAX_VIOLATIONS = 3; // Auto-submit after 3 violations

    constructor(private prisma: PrismaService) { }

    async getAvailableExams(siswaId: string) {
        const now = new Date();

        const ujianSiswa = await this.prisma.ujianSiswa.findMany({
            where: {
                siswaId,
                ujian: {
                    status: {
                        in: [StatusUjian.PUBLISHED, StatusUjian.ONGOING],
                    },
                    tanggalMulai: {
                        lte: now,
                    },
                    tanggalSelesai: {
                        gte: now,
                    },
                    deletedAt: null,
                },
            },
            include: {
                ujian: {
                    include: {
                        mataPelajaran: true,
                        kelas: true,
                        _count: {
                            select: {
                                ujianSoal: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                ujian: {
                    tanggalMulai: 'asc',
                },
            },
        });

        return ujianSiswa;
    }

    async startExam(startUjianDto: StartUjianDto, siswaId: string) {
        const { ujianId, tokenAkses } = startUjianDto;

        // Find ujianSiswa record
        const ujianSiswa = await this.prisma.ujianSiswa.findUnique({
            where: {
                ujianId_siswaId: {
                    ujianId,
                    siswaId,
                },
            },
            include: {
                ujian: true,
            },
        });

        if (!ujianSiswa) {
            throw new NotFoundException('Ujian tidak ditemukan atau belum di-assign ke Anda');
        }

        // Check if exam is available
        const now = new Date();
        if (ujianSiswa.ujian.tanggalMulai > now) {
            throw new BadRequestException('Ujian belum dimulai');
        }

        if (ujianSiswa.ujian.tanggalSelesai < now) {
            throw new BadRequestException('Ujian sudah berakhir');
        }

        // Check if already finished
        if (ujianSiswa.status === StatusPengerjaan.SELESAI) {
            throw new BadRequestException('Anda sudah menyelesaikan ujian ini');
        }

        // Check token if required
        if (ujianSiswa.tokenAkses && ujianSiswa.tokenAkses !== tokenAkses) {
            throw new ForbiddenException('Token akses tidak valid');
        }

        // Start the exam
        const updated = await this.prisma.ujianSiswa.update({
            where: { id: ujianSiswa.id },
            data: {
                waktuMulai: ujianSiswa.waktuMulai || now,
                status: StatusPengerjaan.SEDANG_MENGERJAKAN,
            },
        });

        // Initialize activity log
        this.activityLogs.set(ujianSiswa.id, []);

        return updated;
    }

    async getExamSession(ujianSiswaId: string, siswaId: string) {
        const ujianSiswa = await this.prisma.ujianSiswa.findFirst({
            where: {
                id: ujianSiswaId,
                siswaId,
            },
            include: {
                ujian: {
                    include: {
                        ujianSoal: {
                            include: {
                                bankSoal: {
                                    select: {
                                        id: true,
                                        kode: true,
                                        pertanyaan: true,
                                        tipe: true,
                                        pilihanJawaban: true,
                                        bobot: true,
                                        // Don't include jawabanBenar for security
                                    },
                                },
                            },
                            orderBy: {
                                nomorUrut: 'asc',
                            },
                        },
                    },
                },
            },
        });

        if (!ujianSiswa) {
            throw new NotFoundException('Sesi ujian tidak ditemukan');
        }

        if (ujianSiswa.status !== StatusPengerjaan.SEDANG_MENGERJAKAN) {
            throw new BadRequestException('Sesi ujian tidak aktif');
        }

        // Check if time is up
        if (!ujianSiswa.waktuMulai) {
            throw new BadRequestException('Ujian belum dimulai');
        }

        const now = new Date();
        const waktuMulai = new Date(ujianSiswa.waktuMulai);
        const durasiMs = ujianSiswa.ujian.durasi * 60 * 1000;
        const waktuSelesai = new Date(waktuMulai.getTime() + durasiMs);

        if (now > waktuSelesai) {
            // Auto-submit if time is up
            await this.autoSubmit(ujianSiswaId, 'Waktu habis');
            throw new BadRequestException('Waktu ujian telah habis');
        }

        // Shuffle questions if acakSoal is true
        let soal = ujianSiswa.ujian.ujianSoal;
        if (ujianSiswa.ujian.acakSoal) {
            soal = this.shuffleArray([...soal]);
        }

        return {
            ...ujianSiswa,
            ujian: {
                ...ujianSiswa.ujian,
                ujianSoal: soal,
            },
            waktuSelesai,
            sisaWaktu: Math.max(0, Math.floor((waktuSelesai.getTime() - now.getTime()) / 1000)), // in seconds
        };
    }

    async submitAnswer(ujianSiswaId: string, submitDto: SubmitJawabanDto, siswaId: string) {
        const ujianSiswa = await this.prisma.ujianSiswa.findFirst({
            where: {
                id: ujianSiswaId,
                siswaId,
            },
            include: {
                ujian: {
                    include: {
                        ujianSoal: {
                            include: {
                                bankSoal: true,
                            },
                        },
                    },
                },
            },
        });

        if (!ujianSiswa) {
            throw new NotFoundException('Sesi ujian tidak ditemukan');
        }

        if (ujianSiswa.status === StatusPengerjaan.SELESAI) {
            throw new BadRequestException('Ujian sudah selesai');
        }

        // Calculate score
        const score = await this.calculateScore(ujianSiswa.ujian.ujianSoal, submitDto.jawaban);

        // Calculate duration
        if (!ujianSiswa.waktuMulai) {
            throw new BadRequestException('Ujian belum dimulai');
        }

        const waktuMulai = new Date(ujianSiswa.waktuMulai);
        const waktuSelesai = new Date();
        const durasi = Math.floor((waktuSelesai.getTime() - waktuMulai.getTime()) / 60000); // in minutes

        // Determine if passed
        const isPassed = ujianSiswa.ujian.nilaiMinimal
            ? score >= ujianSiswa.ujian.nilaiMinimal
            : null;

        // Update ujianSiswa
        const updated = await this.prisma.ujianSiswa.update({
            where: { id: ujianSiswaId },
            data: {
                jawaban: submitDto.jawaban as any,
                waktuSelesai,
                durasi,
                status: StatusPengerjaan.SELESAI,
                nilaiTotal: score,
                isPassed,
            },
        });

        return updated;
    }

    async logActivity(logDto: LogActivityDto, siswaId: string) {
        const { ujianSiswaId, activityType, metadata } = logDto;

        // Verify ujianSiswa belongs to siswa
        const ujianSiswa = await this.prisma.ujianSiswa.findFirst({
            where: {
                id: ujianSiswaId,
                siswaId,
            },
        });

        if (!ujianSiswa) {
            throw new NotFoundException('Sesi ujian tidak ditemukan');
        }

        // Get or create activity log array
        const logs = this.activityLogs.get(ujianSiswaId) || [];

        const logEntry = {
            activityType,
            timestamp: new Date(),
            metadata,
        };

        logs.push(logEntry);
        this.activityLogs.set(ujianSiswaId, logs);

        // Check if should auto-submit due to violations
        const violationCount = logs.filter(
            (log) => log.activityType === 'TAB_SWITCH' || log.activityType === 'EXIT_FULLSCREEN'
        ).length;

        if (violationCount >= this.MAX_VIOLATIONS) {
            await this.autoSubmit(ujianSiswaId, 'Terlalu banyak pelanggaran');
            return {
                logged: true,
                autoSubmitted: true,
                message: 'Ujian di-submit otomatis karena terlalu banyak pelanggaran',
            };
        }

        return {
            logged: true,
            violationCount,
            maxViolations: this.MAX_VIOLATIONS,
        };
    }

    async getActivityLogs(ujianSiswaId: string) {
        return this.activityLogs.get(ujianSiswaId) || [];
    }

    async getResult(ujianSiswaId: string, siswaId: string) {
        const ujianSiswa = await this.prisma.ujianSiswa.findFirst({
            where: {
                id: ujianSiswaId,
                siswaId,
            },
            include: {
                ujian: {
                    include: {
                        mataPelajaran: true,
                        ujianSoal: {
                            include: {
                                bankSoal: true,
                            },
                        },
                    },
                },
            },
        });

        if (!ujianSiswa) {
            throw new NotFoundException('Hasil ujian tidak ditemukan');
        }

        if (ujianSiswa.status !== StatusPengerjaan.SELESAI) {
            throw new BadRequestException('Ujian belum selesai');
        }

        // Get activity logs
        const activityLogs = this.activityLogs.get(ujianSiswaId) || [];

        return {
            ...ujianSiswa,
            activityLogs,
        };
    }

    private async autoSubmit(ujianSiswaId: string, reason: string) {
        const ujianSiswa = await this.prisma.ujianSiswa.findUnique({
            where: { id: ujianSiswaId },
        });

        if (!ujianSiswa || ujianSiswa.status === StatusPengerjaan.SELESAI) {
            return;
        }

        if (!ujianSiswa.waktuMulai) {
            return; // Can't calculate duration without start time
        }

        const waktuSelesai = new Date();
        const waktuMulai = new Date(ujianSiswa.waktuMulai);
        const durasi = Math.floor((waktuSelesai.getTime() - waktuMulai.getTime()) / 60000);

        await this.prisma.ujianSiswa.update({
            where: { id: ujianSiswaId },
            data: {
                waktuSelesai,
                durasi,
                status: StatusPengerjaan.SELESAI,
                nilaiTotal: 0, // Auto-submit gets 0 score
                isPassed: false,
            },
        });

        // Log the auto-submit
        const logs = this.activityLogs.get(ujianSiswaId) || [];
        logs.push({
            activityType: 'AUTO_SUBMIT',
            timestamp: new Date(),
            metadata: { reason },
        });
        this.activityLogs.set(ujianSiswaId, logs);
    }

    private async calculateScore(ujianSoal: any[], jawaban: any[]): Promise<number> {
        let totalScore = 0;
        let maxScore = 0;

        for (const soal of ujianSoal) {
            maxScore += soal.bobot;

            const jawabanSiswa = jawaban.find((j) => j.soalId === soal.bankSoalId);
            if (!jawabanSiswa) continue;

            // Only auto-grade multiple choice and true/false
            if (soal.bankSoal.tipe === TipeSoal.PILIHAN_GANDA || soal.bankSoal.tipe === TipeSoal.BENAR_SALAH) {
                const pilihanJawaban = soal.bankSoal.pilihanJawaban as any[];
                const correctAnswer = pilihanJawaban?.find((p) => p.isCorrect);

                if (correctAnswer && jawabanSiswa.jawaban === correctAnswer.id) {
                    totalScore += soal.bobot;
                }
            }
            // Essay and short answer need manual grading
        }

        // Return percentage score
        return maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    }

    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}
