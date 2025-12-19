import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUjianDto } from './dto/create-ujian.dto';
import { UpdateUjianDto } from './dto/update-ujian.dto';
import { FilterUjianDto } from './dto/filter-ujian.dto';
import { Prisma, StatusUjian, StatusPengerjaan } from '@prisma/client';

@Injectable()
export class UjianService {
    constructor(private prisma: PrismaService) { }

    async create(createUjianDto: CreateUjianDto, createdBy: string) {
        const { paketSoalId, kelasIds, siswaIds, ...rest } = createUjianDto;
        
        // Prepare ujianData with only valid Prisma fields (exclude kelasIds and siswaIds which are handled separately)
        const tanggalMulai = new Date(rest.tanggalMulai);
        const tanggalSelesai = new Date(rest.tanggalSelesai);

        if (isNaN(tanggalMulai.getTime()) || isNaN(tanggalSelesai.getTime())) {
            throw new BadRequestException('Tanggal mulai dan selesai harus valid');
        }

        const ujianData = {
            judul: rest.judul,
            deskripsi: rest.deskripsi,
            mataPelajaranId: rest.mataPelajaranId || null,
            guruId: rest.guruId || null,
            durasi: rest.durasi,
            tanggalMulai,
            tanggalSelesai,
            nilaiMinimal: rest.nilaiMinimal || null,
            acakSoal: rest.acakSoal ?? true,
            tampilkanNilai: rest.tampilkanNilai ?? false,
        };

        // Validate paketSoalId
        if (!paketSoalId) {
            throw new BadRequestException('Paket soal harus dipilih');
        }

        // Validate and get paket soal with soal items
        const paketSoal = await this.prisma.paketSoal.findFirst({
            where: {
                id: paketSoalId,
                deletedAt: null,
            },
            include: {
                soalItems: {
                    include: {
                        bankSoal: true,
                    },
                    orderBy: {
                        urutan: 'asc',
                    },
                },
            },
        });

        if (!paketSoal) {
            throw new NotFoundException('Paket soal tidak ditemukan');
        }

        if (!paketSoal.soalItems || paketSoal.soalItems.length === 0) {
            throw new BadRequestException('Paket soal tidak memiliki soal');
        }

        // Validate mataPelajaranId if provided
        if (createUjianDto.mataPelajaranId) {
            const mataPelajaran = await this.prisma.mataPelajaran.findUnique({
                where: { id: createUjianDto.mataPelajaranId },
            });
            if (!mataPelajaran) {
                throw new NotFoundException('Mata pelajaran tidak ditemukan');
            }
        }

        // Validate guruId if provided
        if (createUjianDto.guruId) {
            const guru = await this.prisma.guru.findFirst({
                where: {
                    id: createUjianDto.guruId,
                    deletedAt: null,
                },
            });
            if (!guru) {
                throw new NotFoundException('Guru tidak ditemukan');
            }
        }

        // Validate kelasIds if provided
        if (kelasIds && kelasIds.length > 0) {
            const kelasCount = await this.prisma.kelas.count({
                where: {
                    id: { in: kelasIds },
                    deletedAt: null,
                },
            });
            if (kelasCount !== kelasIds.length) {
                throw new NotFoundException('Beberapa kelas tidak ditemukan');
            }
        }

        // Validate siswaIds if provided
        if (siswaIds && siswaIds.length > 0) {
            const siswaCount = await this.prisma.siswa.count({
                where: {
                    id: { in: siswaIds },
                    deletedAt: null,
                    status: 'AKTIF',
                },
            });
            if (siswaCount !== siswaIds.length) {
                throw new NotFoundException('Beberapa siswa tidak ditemukan atau tidak aktif');
            }

            // If siswaIds provided, ensure kelasIds are also provided
            if (!kelasIds || kelasIds.length === 0) {
                throw new BadRequestException('Kelas harus dipilih jika memilih siswa spesifik');
            }

            // Validate that all selected students belong to the selected classes
            const validStudents = await this.prisma.siswa.count({
                where: {
                    id: { in: siswaIds },
                    kelasId: { in: kelasIds },
                },
            });
            if (validStudents !== siswaIds.length) {
                throw new BadRequestException('Beberapa siswa tidak termasuk dalam kelas yang dipilih');
            }
        }

        const maxKodeRetries = 3;
        for (let attempt = 0; attempt < maxKodeRetries; attempt++) {
            const kode = await this.generateKode();
            try {
                // Create ujian with soal relations from paket soal and UjianKelas relations
                const ujian = await this.prisma.ujian.create({
                    data: {
                        ...ujianData,
                        paketSoalId,
                        kode,
                        createdBy,
                        status: StatusUjian.DRAFT,
                        ujianSoal: {
                            create: paketSoal.soalItems.map((item, index) => ({
                                bankSoalId: item.bankSoalId,
                                nomorUrut: item.urutan || index + 1,
                                bobot: item.bankSoal?.bobot ?? 1,
                            })),
                        },
                        // Create UjianKelas records for multi-class support
                        ujianKelas: kelasIds && kelasIds.length > 0 ? {
                            create: kelasIds.map((kelasId) => ({
                                kelasId,
                            })),
                        } : undefined,
                    },
                    include: {
                        mataPelajaran: true,
                        guru: true,
                        paketSoal: true,
                        kelas: true,
                        ujianKelas: {
                            include: {
                                kelas: true,
                            },
                        },
                        ujianSoal: {
                            include: {
                                bankSoal: true,
                            },
                            orderBy: {
                                nomorUrut: 'asc',
                            },
                        },
                    },
                });

                // Store siswaIds in the response metadata (we'll use this during assignment)
                // Note: We're not storing siswaIds in the database directly, 
                // but will use them when assignToStudents is called
                return {
                    ...ujian,
                    _metadata: {
                        selectedSiswaIds: siswaIds || [],
                    },
                };
            } catch (error) {
                const isKodeDuplicate =
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2002' &&
                    this.isKodeUniqueConstraint(error.meta?.target);

                if (isKodeDuplicate && attempt < maxKodeRetries - 1) {
                    // Retry with a fresh kode
                    continue;
                }

                if (isKodeDuplicate) {
                    throw new ConflictException('Kode ujian sudah digunakan, silakan coba lagi.');
                }

                throw error;
            }
        }

        throw new ConflictException('Gagal membuat ujian karena kode unik tidak tersedia.');
    }

    private isKodeUniqueConstraint(target: unknown): boolean {
        if (typeof target === 'string') {
            return target.includes('Ujian_kode_key') || target.includes('kode');
        }

        if (Array.isArray(target)) {
            return target.includes('kode');
        }

        return false;
    }

    async findAll(filterDto: FilterUjianDto) {
        const { search, mataPelajaranId, kelasId, status, page = 1, limit = 10 } = filterDto;
        const skip = (page - 1) * limit;

        const where: any = {
            deletedAt: null,
        };

        if (search) {
            where.OR = [
                { judul: { contains: search, mode: 'insensitive' } },
                { kode: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (mataPelajaranId) {
            where.mataPelajaranId = mataPelajaranId;
        }

        if (kelasId) {
            where.kelasId = kelasId;
        }

        if (status) {
            where.status = status;
        }

        const [data, total] = await Promise.all([
            this.prisma.ujian.findMany({
                where,
                skip,
                take: limit,
                include: {
                    mataPelajaran: true,
                    guru: true,
                    paketSoal: true,
                    kelas: true,
                    _count: {
                        select: {
                            ujianSoal: true,
                            ujianSiswa: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.ujian.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const ujian = await this.prisma.ujian.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                mataPelajaran: true,
                guru: true,
                paketSoal: true,
                kelas: true,
                ujianSoal: {
                    include: {
                        bankSoal: true,
                    },
                    orderBy: {
                        nomorUrut: 'asc',
                    },
                },
                _count: {
                    select: {
                        ujianSiswa: true,
                    },
                },
            },
        });

        if (!ujian) {
            throw new NotFoundException('Ujian tidak ditemukan');
        }

        return ujian;
    }

    async update(id: string, updateUjianDto: UpdateUjianDto) {
        const ujian = await this.findOne(id);

        // Check if ujian can be updated (not if already finished)
        if (ujian.status === StatusUjian.SELESAI) {
            throw new BadRequestException('Ujian yang sudah selesai tidak dapat diubah');
        }

        const { paketSoalId, kelasIds, siswaIds, ...ujianData } = updateUjianDto;

        // If paketSoalId provided, update the soal relations from paket soal
        if (paketSoalId) {
            // Validate and get paket soal with soal items
            const paketSoal = await this.prisma.paketSoal.findFirst({
                where: {
                    id: paketSoalId,
                    deletedAt: null,
                },
                include: {
                    soalItems: {
                        include: {
                            bankSoal: true,
                        },
                        orderBy: {
                            urutan: 'asc',
                        },
                    },
                },
            });

            if (!paketSoal) {
                throw new NotFoundException('Paket soal tidak ditemukan');
            }

            if (!paketSoal.soalItems || paketSoal.soalItems.length === 0) {
                throw new BadRequestException('Paket soal tidak memiliki soal');
            }

            // Delete existing relations and create new ones from paket soal
            await this.prisma.ujianSoal.deleteMany({
                where: { ujianId: id },
            });

            await this.prisma.ujianSoal.createMany({
                data: paketSoal.soalItems.map((item, index) => ({
                    ujianId: id,
                    bankSoalId: item.bankSoalId,
                    nomorUrut: item.urutan || index + 1,
                    bobot: 1,
                })),
            });
        }

        // Validate mataPelajaranId if provided
        if (updateUjianDto.mataPelajaranId) {
            const mataPelajaran = await this.prisma.mataPelajaran.findUnique({
                where: { id: updateUjianDto.mataPelajaranId },
            });
            if (!mataPelajaran) {
                throw new NotFoundException('Mata pelajaran tidak ditemukan');
            }
        }

        // Validate guruId if provided
        if (updateUjianDto.guruId) {
            const guru = await this.prisma.guru.findFirst({
                where: {
                    id: updateUjianDto.guruId,
                    deletedAt: null,
                },
            });
            if (!guru) {
                throw new NotFoundException('Guru tidak ditemukan');
            }
        }

        // Validate kelasIds if provided
        if (updateUjianDto.kelasIds && updateUjianDto.kelasIds.length > 0) {
            const kelasCount = await this.prisma.kelas.count({
                where: {
                    id: { in: updateUjianDto.kelasIds },
                    deletedAt: null,
                },
            });
            if (kelasCount !== updateUjianDto.kelasIds.length) {
                throw new NotFoundException('Beberapa kelas tidak ditemukan');
            }

            // Update UjianKelas relations
            // Delete existing relations
            await this.prisma.ujianKelas.deleteMany({
                where: { ujianId: id },
            });

            // Create new relations
            await this.prisma.ujianKelas.createMany({
                data: updateUjianDto.kelasIds.map((kelasId) => ({
                    ujianId: id,
                    kelasId,
                })),
            });
        }

        return this.prisma.ujian.update({
            where: { id },
            data: ujianData,
            include: {
                mataPelajaran: true,
                guru: true,
                paketSoal: true,
                kelas: true,
                ujianSoal: {
                    include: {
                        bankSoal: true,
                    },
                    orderBy: {
                        nomorUrut: 'asc',
                    },
                },
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        // Soft delete
        return this.prisma.ujian.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async publish(id: string) {
        const ujian = await this.findOne(id);

        if (ujian.status !== StatusUjian.DRAFT) {
            throw new BadRequestException('Hanya ujian dengan status DRAFT yang dapat dipublish');
        }

        return this.prisma.ujian.update({
            where: { id },
            data: {
                status: StatusUjian.PUBLISHED,
            },
        });
    }

    async assignToStudents(id: string, siswaIds?: string[]) {
        const ujian = await this.prisma.ujian.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                ujianKelas: {
                    include: {
                        kelas: true,
                    },
                },
            },
        });

        if (!ujian) {
            throw new NotFoundException('Ujian tidak ditemukan');
        }

        if (ujian.status === StatusUjian.DRAFT) {
            throw new BadRequestException('Ujian harus dipublish terlebih dahulu');
        }

        let siswaToAssign: any[] = [];

        // If specific siswaIds provided, use those
        if (siswaIds && siswaIds.length > 0) {
            siswaToAssign = await this.prisma.siswa.findMany({
                where: {
                    id: { in: siswaIds },
                    status: 'AKTIF',
                    deletedAt: null,
                },
            });

            if (siswaToAssign.length !== siswaIds.length) {
                throw new NotFoundException('Beberapa siswa tidak ditemukan atau tidak aktif');
            }
        } else {
            // Otherwise, get all active students from all assigned classes
            if (!ujian.ujianKelas || ujian.ujianKelas.length === 0) {
                // Fallback to old kelasId if no ujianKelas
                if (!ujian.kelasId) {
                    throw new BadRequestException('Ujian harus memiliki kelas untuk assign ke siswa');
                }

                siswaToAssign = await this.prisma.siswa.findMany({
                    where: {
                        kelasId: ujian.kelasId,
                        status: 'AKTIF',
                        deletedAt: null,
                    },
                });
            } else {
                // Get all students from all assigned classes
                const kelasIds = ujian.ujianKelas.map((uk) => uk.kelasId);
                siswaToAssign = await this.prisma.siswa.findMany({
                    where: {
                        kelasId: { in: kelasIds },
                        status: 'AKTIF',
                        deletedAt: null,
                    },
                });
            }
        }

        if (siswaToAssign.length === 0) {
            throw new NotFoundException('Tidak ada siswa aktif untuk di-assign');
        }

        // Create UjianSiswa records for each student
        const ujianSiswaData = siswaToAssign.map((s) => ({
            ujianId: id,
            siswaId: s.id,
            status: StatusPengerjaan.BELUM_MULAI,
        }));

        // Use createMany with skipDuplicates to avoid conflicts
        await this.prisma.ujianSiswa.createMany({
            data: ujianSiswaData,
            skipDuplicates: true,
        });

        return {
            message: `Ujian berhasil di-assign ke ${siswaToAssign.length} siswa`,
            totalSiswa: siswaToAssign.length,
        };
    }

    async generateKode(): Promise<string> {
        const prefix = 'UJI';
        const lastExam = await this.prisma.ujian.findFirst({
            where: {
                kode: {
                    startsWith: `${prefix}-`,
                },
            },
            orderBy: {
                kode: 'desc',
            },
            select: {
                kode: true,
            },
        });

        const lastNumber = lastExam
            ? parseInt(lastExam.kode.replace(`${prefix}-`, ''), 10) || 0
            : 0;
        const nextNumber = lastNumber + 1;

        return `${prefix}-${nextNumber.toString().padStart(5, '0')}`;
    }
}
