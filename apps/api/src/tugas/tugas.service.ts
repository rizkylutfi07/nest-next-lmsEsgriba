import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotifikasiService } from '../notifikasi/notifikasi.service';
import { CreateTugasDto, UpdateTugasDto, SubmitTugasDto } from './dto/tugas.dto';
import { StatusPengumpulan } from '@prisma/client';

@Injectable()
export class TugasService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notifikasiService: NotifikasiService,
    ) { }

    async create(guruId: string, data: CreateTugasDto) {
        const tugas = await this.prisma.tugas.create({
            data: {
                ...data,
                guruId,
                deadline: new Date(data.deadline),
            },
            include: {
                mataPelajaran: true,
                guru: true,
                kelas: true,
                attachments: true,
            },
        });

        // Trigger notification if published
        if (tugas.isPublished) {
            try {
                await this.notifikasiService.notifyTugasBaru(
                    tugas.id,
                    tugas.kelasId,
                    tugas.mataPelajaran.nama,
                    tugas.guru.nama || 'Guru',
                    tugas.deadline,
                );
            } catch (error) {
                console.error('Failed to send tugas notification:', error);
            }
        }

        return tugas;
    }

    async findAll(filters?: any) {
        const where: any = { deletedAt: null };

        if (filters?.mataPelajaranId) {
            where.mataPelajaranId = filters.mataPelajaranId;
        }
        if (filters?.kelasId) {
            where.kelasId = filters.kelasId;
        }
        if (filters?.guruId) {
            where.guruId = filters.guruId;
        }
        if (filters?.isPublished !== undefined) {
            where.isPublished = filters.isPublished === 'true' || filters.isPublished === true;
        }

        // Build include object - include student's own submissions if siswaId provided
        const include: any = {
            mataPelajaran: { select: { id: true, nama: true } },
            guru: { select: { id: true, nama: true } },
            kelas: { select: { id: true, nama: true } },
            _count: { select: { submissions: true } },
        };


        // If siswaId is provided, include attachments and student's submissions
        if (filters?.siswaId) {
            include.attachments = true; // Include teacher's attachments for students
            include.submissions = {
                where: { siswaId: filters.siswaId },
                select: {
                    id: true,
                    status: true,
                    score: true,
                    submittedAt: true,
                    gradedAt: true,
                    feedback: true,
                    konten: true,
                },
            };
        }

        return this.prisma.tugas.findMany({
            where,
            include,
            orderBy: { deadline: 'asc' },
        });
    }

    async findOne(id: string) {
        const tugas = await this.prisma.tugas.findUnique({
            where: { id },
            include: {
                mataPelajaran: true,
                guru: true,
                kelas: true,
                attachments: true,
                submissions: {
                    include: {
                        siswa: { select: { id: true, nama: true, nisn: true } },
                        files: true,
                    },
                    orderBy: { submittedAt: 'desc' },
                },
            },
        });

        if (!tugas) {
            throw new NotFoundException('Tugas tidak ditemukan');
        }

        return tugas;
    }

    async update(id: string, guruId: string | null, data: UpdateTugasDto, isAdmin: boolean = false) {
        const tugas = await this.prisma.tugas.findUnique({
            where: { id },
        });

        if (!tugas) {
            throw new NotFoundException('Tugas tidak ditemukan');
        }

        // Only allow the creator or admin to update
        if (!isAdmin && tugas.guruId !== guruId) {
            throw new ForbiddenException('Anda tidak memiliki akses untuk mengubah tugas ini');
        }

        const updateData: any = { ...data };
        if (data.deadline) {
            updateData.deadline = new Date(data.deadline);
        }

        return this.prisma.tugas.update({
            where: { id },
            data: updateData,
            include: {
                mataPelajaran: true,
                guru: true,
                kelas: true,
                attachments: true,
            },
        });
    }

    async remove(id: string, guruId: string | null, isAdmin: boolean = false) {
        const tugas = await this.prisma.tugas.findUnique({
            where: { id },
        });

        if (!tugas) {
            throw new NotFoundException('Tugas tidak ditemukan');
        }

        // Only allow the creator or admin to delete
        if (!isAdmin && tugas.guruId !== guruId) {
            throw new ForbiddenException('Anda tidak memiliki akses untuk menghapus tugas ini');
        }

        // Soft delete
        return this.prisma.tugas.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async getSubmissions(tugasId: string) {
        const tugas = await this.prisma.tugas.findUnique({
            where: { id: tugasId },
        });

        if (!tugas) {
            throw new NotFoundException('Tugas tidak ditemukan');
        }

        return this.prisma.tugasSiswa.findMany({
            where: { tugasId },
            include: {
                siswa: {
                    select: {
                        id: true,
                        nama: true,
                        nisn: true,
                        kelas: { select: { id: true, nama: true } },
                    },
                },
                files: true,
            },
            orderBy: { submittedAt: 'desc' },
        });
    }

    async submitTugas(tugasId: string, siswaId: string, data: SubmitTugasDto) {
        const tugas = await this.prisma.tugas.findUnique({
            where: { id: tugasId },
        });

        if (!tugas) {
            throw new NotFoundException('Tugas tidak ditemukan');
        }

        if (!tugas.isPublished) {
            throw new BadRequestException('Tugas belum dipublikasikan');
        }

        const now = new Date();
        const isLate = now > tugas.deadline;

        // Check if late submission is allowed
        if (isLate && !tugas.allowLateSubmit) {
            throw new BadRequestException('Waktu pengumpulan telah berakhir');
        }

        // Determine status based on deadline
        const status: StatusPengumpulan = isLate ? StatusPengumpulan.TERLAMBAT : StatusPengumpulan.DIKUMPULKAN;

        // Check if already submitted
        const existing = await this.prisma.tugasSiswa.findUnique({
            where: { tugasId_siswaId: { tugasId, siswaId } },
        });

        if (existing) {
            // Update existing submission
            const updated = await this.prisma.tugasSiswa.update({
                where: { tugasId_siswaId: { tugasId, siswaId } },
                data: {
                    konten: data.konten,
                    status,
                    submittedAt: now,
                },
                include: { files: true, siswa: true },
            });

            // Trigger notification to guru
            try {
                await this.notifikasiService.notifyTugasDikumpulkan(
                    tugasId,
                    tugas.guruId,
                    updated.siswa.nama,
                    tugas.judul,
                );
            } catch (error) {
                console.error('Failed to send submission notification:', error);
            }

            return updated;
        }

        // Create new submission
        const submission = await this.prisma.tugasSiswa.create({
            data: {
                tugasId,
                siswaId,
                konten: data.konten,
                status,
                submittedAt: now,
            },
            include: { files: true, siswa: true },
        });

        // Trigger notification to guru
        try {
            await this.notifikasiService.notifyTugasDikumpulkan(
                tugasId,
                tugas.guruId,
                submission.siswa.nama,
                tugas.judul,
            );
        } catch (error) {
            console.error('Failed to send submission notification:', error);
        }

        return submission;
    }

    async addSubmissionFile(tugasSiswaId: string, fileName: string, fileSize: number, fileType: string, fileUrl: string) {
        return this.prisma.tugasSiswaFile.create({
            data: {
                tugasSiswaId,
                namaFile: fileName,
                ukuranFile: fileSize,
                tipeFile: fileType,
                urlFile: fileUrl,
            },
        });
    }

    async gradeTugas(tugasId: string, siswaId: string, score: number, feedback?: string) {
        const submission = await this.prisma.tugasSiswa.findUnique({
            where: { tugasId_siswaId: { tugasId, siswaId } },
        });

        if (!submission) {
            throw new NotFoundException('Pengumpulan tidak ditemukan');
        }

        const tugas = await this.prisma.tugas.findUnique({
            where: { id: tugasId },
        });

        const graded = await this.prisma.tugasSiswa.update({
            where: { tugasId_siswaId: { tugasId, siswaId } },
            data: {
                score,
                feedback,
                status: StatusPengumpulan.DINILAI,
                gradedAt: new Date(),
            },
        });

        // Trigger notification to siswa
        if (tugas) {
            try {
                await this.notifikasiService.notifyTugasDinilai(
                    tugasId,
                    siswaId,
                    tugas.judul,
                    score,
                    tugas.maxScore,
                );
            } catch (error) {
                console.error('Failed to send grading notification:', error);
            }
        }

        return graded;
    }

    async addAttachment(tugasId: string, fileName: string, fileSize: number, fileType: string, fileUrl: string) {
        return this.prisma.tugasAttachment.create({
            data: {
                tugasId,
                namaFile: fileName,
                ukuranFile: fileSize,
                tipeFile: fileType,
                urlFile: fileUrl,
            },
        });
    }
}
