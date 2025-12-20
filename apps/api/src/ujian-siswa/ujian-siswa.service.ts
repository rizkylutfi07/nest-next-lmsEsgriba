import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartUjianDto } from './dto/start-ujian.dto';
import { SubmitJawabanDto } from './dto/submit-jawaban.dto';
import { LogActivityDto } from './dto/log-activity.dto';
import { GradeExamDto } from './dto/grade-exam.dto';
import { StatusUjian, StatusPengerjaan, TipeSoal } from '@prisma/client';

@Injectable()
export class UjianSiswaService {
    private activityLogs: Map<string, any[]> = new Map(); // In-memory storage for activity logs
    private readonly MAX_VIOLATIONS = 1; // Auto-block after 1 violation

    constructor(private prisma: PrismaService) { }
    private normalizeText(text: string) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\u00C0-\u024f\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    private isEssayCorrect(kunci: string | null | undefined, jawabanSiswa: string | null | undefined) {
        if (!kunci || !jawabanSiswa) return false;
        const keyNorm = this.normalizeText(kunci);
        const ansNorm = this.normalizeText(jawabanSiswa);
        if (!keyNorm || !ansNorm) return false;
        if (keyNorm === ansNorm) return true;
        if (ansNorm.includes(keyNorm) || keyNorm.includes(ansNorm)) return true;

        const keyTokens = new Set(keyNorm.split(' '));
        const ansTokens = new Set(ansNorm.split(' '));
        const intersect = [...keyTokens].filter((t) => ansTokens.has(t)).length;
        const union = new Set([...keyTokens, ...ansTokens]).size || 1;
        const jaccard = intersect / union;
        return jaccard >= 0.5;
    }

    private computeScore(ujianSoal: any[], jawaban: any[], overrides?: Record<string, number | null>) {
        let totalScore = 0;
        let maxScore = 0;

        for (const soal of ujianSoal) {
            const bobot = soal?.bankSoal?.bobot ?? soal?.bobot ?? 1;
            maxScore += bobot;

            const jawabanSiswa = jawaban.find((j) => j.soalId === soal.bankSoalId);
            if (!jawabanSiswa) continue;

            if (overrides && overrides.hasOwnProperty(soal.bankSoalId)) {
                const overrideScore = overrides[soal.bankSoalId];
                if (overrideScore !== null && overrideScore !== undefined) {
                    totalScore += Math.min(Math.max(overrideScore, 0), bobot);
                }
                continue;
            }

            if (soal.bankSoal.tipe === TipeSoal.PILIHAN_GANDA || soal.bankSoal.tipe === TipeSoal.BENAR_SALAH) {
                const pilihanJawaban = soal.bankSoal.pilihanJawaban as any[];
                const correctAnswer = pilihanJawaban?.find((p) => p.isCorrect);
                if (correctAnswer && jawabanSiswa.jawaban === correctAnswer.id) {
                    totalScore += bobot;
                }
            } else if (soal.bankSoal.tipe === TipeSoal.ESSAY || soal.bankSoal.tipe === TipeSoal.ISIAN_SINGKAT) {
                if (this.isEssayCorrect(soal.bankSoal.jawabanBenar, jawabanSiswa.jawaban)) {
                    totalScore += bobot;
                }
            }
        }

        return {
            score: maxScore > 0 ? (totalScore / maxScore) * 100 : 0,
            totalScore,
            maxScore,
        };
    }

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

        if (ujianSiswa.status === StatusPengerjaan.SELESAI) {
            throw new BadRequestException('Ujian sudah selesai');
        }

        if (ujianSiswa.status === StatusPengerjaan.BELUM_MULAI) {
            throw new BadRequestException('Ujian belum dimulai');
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
            // Deterministic shuffle per ujianSiswa to avoid reordering on refresh
            soal = this.shuffleArrayStable([...soal], ujianSiswa.id);
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

        // Ensure waktuMulai exists to avoid submission being blocked
        const waktuMulai = ujianSiswa.waktuMulai ?? new Date();
        if (!ujianSiswa.waktuMulai) {
            await this.prisma.ujianSiswa.update({
                where: { id: ujianSiswaId },
                data: { waktuMulai, status: StatusPengerjaan.SEDANG_MENGERJAKAN },
            });
        }

        // Calculate score
        const { score } = this.computeScore(ujianSiswa.ujian.ujianSoal, submitDto.jawaban);

        // Calculate duration
        const waktuMulaiDate = new Date(waktuMulai);
        const waktuSelesai = new Date();
        const durasi = Math.floor((waktuSelesai.getTime() - waktuMulaiDate.getTime()) / 60000); // in minutes

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

    async saveProgress(ujianSiswaId: string, submitDto: SubmitJawabanDto, siswaId: string) {
        const ujianSiswa = await this.prisma.ujianSiswa.findFirst({
            where: {
                id: ujianSiswaId,
                siswaId,
            },
        });

        if (!ujianSiswa) {
            throw new NotFoundException('Sesi ujian tidak ditemukan');
        }

        if (ujianSiswa.status === StatusPengerjaan.SELESAI) {
            throw new BadRequestException('Ujian sudah selesai');
        }

        const waktuMulai = ujianSiswa.waktuMulai ?? new Date();

        const updated = await this.prisma.ujianSiswa.update({
            where: { id: ujianSiswaId },
            data: {
                jawaban: submitDto.jawaban as any,
                waktuMulai,
                status: ujianSiswa.status === StatusPengerjaan.BELUM_MULAI
                    ? StatusPengerjaan.SEDANG_MENGERJAKAN
                    : ujianSiswa.status,
            },
        });

        const answeredCount = Array.isArray(updated.jawaban)
            ? updated.jawaban.length
            : updated.jawaban && typeof updated.jawaban === 'object'
                ? Object.keys(updated.jawaban as any).length
                : 0;

        return {
            saved: true,
            answeredCount,
        };
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
            await this.blockStudent(ujianSiswaId);
            return {
                logged: true,
                blocked: true,
                message: 'Akun Anda diblokir sementara karena terdeteksi melakukan kecurangan. Hubungi pengawas untuk membuka blokir.',
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
        const { score } = this.computeScore(ujianSoal, jawaban);
        return score;
    }

    async getMonitoringData(ujianId: string) {
        const getAnsweredCount = (jawaban: any): number => {
            if (!jawaban) return 0;
            if (Array.isArray(jawaban)) return jawaban.length;
            if (typeof jawaban === 'object') return Object.keys(jawaban).length;
            return 0;
        };

        const result = await this.prisma.ujianSiswa.findMany({
            where: {
                ujianId,
            },
            include: {
                siswa: {
                    include: {
                        kelas: true,
                    },
                },
                ujian: {
                    select: {
                        ujianSoal: {
                            include: {
                                bankSoal: true,
                            },
                        },
                        _count: {
                            select: {
                                ujianSoal: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                siswa: {
                    nama: 'asc',
                },
            },
        });

        // Attach violation count and PG stats from in-memory logs and calculation
        return result.map(u => {
            const logs = this.activityLogs.get(u.id) || [];
            const violationCount = logs.filter(
                (log) => log.activityType === 'TAB_SWITCH' || log.activityType === 'EXIT_FULLSCREEN'
            ).length;

            // Calculate PG stats
            let pgBenar = 0;
            let pgSalah = 0;
            const jawabanSiswa = u.jawaban as any[] || [];

            if (Array.isArray(jawabanSiswa)) {
                u.ujian.ujianSoal.forEach(soal => {
                    if (soal.bankSoal?.tipe === TipeSoal.PILIHAN_GANDA || soal.bankSoal?.tipe === TipeSoal.BENAR_SALAH) {
                        const jawab = jawabanSiswa.find(j => j.soalId === soal.bankSoalId);
                        if (jawab) {
                            const pilihan = soal.bankSoal.pilihanJawaban as any[];
                            const benar = pilihan?.find(p => p.isCorrect);
                            if (benar && jawab.jawaban === benar.id) {
                                pgBenar++;
                            } else {
                                pgSalah++;
                            }
                        }
                    }
                });
            }

            return {
                ...u,
                violationCount,
                answeredCount: getAnsweredCount(u.jawaban),
                pgBenar,
                pgSalah,
            };
        });
    }

    async blockStudent(ujianSiswaId: string) {
        return this.prisma.ujianSiswa.update({
            where: { id: ujianSiswaId },
            data: {
                status: StatusPengerjaan.DIBLOKIR,
            },
        });
    }

    async unblockStudent(ujianSiswaId: string) {
        return this.prisma.ujianSiswa.update({
            where: { id: ujianSiswaId },
            data: {
                status: StatusPengerjaan.SEDANG_MENGERJAKAN,
            },
        });
    }

    private shuffleArrayStable<T>(array: T[], seedString: string): T[] {
        // Create deterministic random generator from seed string
        const seed = this.hashStringToSeed(seedString);
        const rand = this.mulberry32(seed);
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    private hashStringToSeed(str: string): number {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = Math.imul(31, h) + str.charCodeAt(i);
        }
        return h >>> 0; // Ensure positive 32-bit
    }

    private mulberry32(a: number) {
        return function () {
            let t = (a += 0x6d2b79f5);
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    async getReview(ujianSiswaId: string) {
        const ujianSiswa = await this.prisma.ujianSiswa.findUnique({
            where: { id: ujianSiswaId },
            include: {
                ujian: {
                    include: {
                        ujianSoal: {
                            include: {
                                bankSoal: true,
                            },
                            orderBy: { nomorUrut: 'asc' },
                        },
                    },
                },
            },
        });

        if (!ujianSiswa) {
            throw new NotFoundException('Sesi ujian tidak ditemukan');
        }

        return ujianSiswa;
    }

    async gradeExam(ujianSiswaId: string, gradeDto: GradeExamDto) {
        const ujianSiswa = await this.prisma.ujianSiswa.findUnique({
            where: { id: ujianSiswaId },
            include: {
                ujian: {
                    include: {
                        ujianSoal: {
                            include: {
                                bankSoal: true,
                            },
                            orderBy: { nomorUrut: 'asc' },
                        },
                    },
                },
            },
        });

        if (!ujianSiswa) {
            throw new NotFoundException('Sesi ujian tidak ditemukan');
        }

        const overrides: Record<string, number | null> = {};
        gradeDto.grades.forEach((g) => {
            overrides[g.soalId] = g.score;
        });

        const jawabanArr = Array.isArray(ujianSiswa.jawaban) ? ujianSiswa.jawaban as any[] : [];
        const { score, totalScore, maxScore } = this.computeScore(ujianSiswa.ujian.ujianSoal, jawabanArr, overrides);

        const updated = await this.prisma.ujianSiswa.update({
            where: { id: ujianSiswaId },
            data: {
                nilaiTotal: score,
                isPassed: ujianSiswa.ujian.nilaiMinimal ? score >= ujianSiswa.ujian.nilaiMinimal : null,
                updatedAt: new Date(),
            },
        });

        return {
            ...updated,
            manualOverride: true,
            totalScore,
            maxScore,
        };
    }
}
