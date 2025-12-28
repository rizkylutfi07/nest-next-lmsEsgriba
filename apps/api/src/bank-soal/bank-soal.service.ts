import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankSoalDto } from './dto/create-bank-soal.dto';
import { UpdateBankSoalDto } from './dto/update-bank-soal.dto';
import { FilterBankSoalDto } from './dto/filter-bank-soal.dto';

@Injectable()
export class BankSoalService {
    constructor(private prisma: PrismaService) { }

    async create(createBankSoalDto: CreateBankSoalDto) {
        // Check if kode already exists
        const existing = await this.prisma.bankSoal.findUnique({
            where: { kode: createBankSoalDto.kode },
        });

        if (existing) {
            throw new ConflictException(`Kode soal ${createBankSoalDto.kode} sudah digunakan`);
        }

        // Validate mataPelajaranId if provided
        if (createBankSoalDto.mataPelajaranId) {
            const mataPelajaran = await this.prisma.mataPelajaran.findUnique({
                where: { id: createBankSoalDto.mataPelajaranId },
            });
            if (!mataPelajaran) {
                throw new NotFoundException('Mata pelajaran tidak ditemukan');
            }
        }

        return this.prisma.bankSoal.create({
            data: createBankSoalDto,
            include: {
                mataPelajaran: true,
            },
        });
    }

    async findAll(filterDto: FilterBankSoalDto) {
        const { search, tipe, mataPelajaranId, mataPelajaranIds, guruId, kelasId, kelasIds, page = 1, limit = 10 } = filterDto;
        const skip = (page - 1) * limit;

        const where: any = {
            deletedAt: null,
        };

        if (search) {
            where.pertanyaan = {
                contains: search,
                mode: 'insensitive',
            };
        }

        if (tipe) {
            where.tipe = tipe;
        }

        if (mataPelajaranId) {
            where.mataPelajaranId = mataPelajaranId;
        } else if (mataPelajaranIds && mataPelajaranIds.length > 0) {
            where.mataPelajaranId = { in: mataPelajaranIds };
        }

        if (guruId) {
            where.guruId = guruId;
        }

        if (kelasId) {
            where.kelasId = kelasId;
        } else if (kelasIds && kelasIds.length > 0) {
            where.kelasId = { in: kelasIds };
        }

        const [data, total] = await Promise.all([
            this.prisma.bankSoal.findMany({
                where,
                skip,
                take: limit,
                include: {
                    mataPelajaran: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.bankSoal.count({ where }),
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
        const bankSoal = await this.prisma.bankSoal.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                mataPelajaran: true,
            },
        });

        if (!bankSoal) {
            throw new NotFoundException('Soal tidak ditemukan');
        }

        return bankSoal;
    }

    async update(id: string, updateBankSoalDto: UpdateBankSoalDto) {
        await this.findOne(id); // Check if exists

        // Check kode uniqueness if updating kode
        if (updateBankSoalDto.kode) {
            const existing = await this.prisma.bankSoal.findFirst({
                where: {
                    kode: updateBankSoalDto.kode,
                    id: { not: id },
                },
            });

            if (existing) {
                throw new ConflictException(`Kode soal ${updateBankSoalDto.kode} sudah digunakan`);
            }
        }

        // Validate mataPelajaranId if provided
        if (updateBankSoalDto.mataPelajaranId) {
            const mataPelajaran = await this.prisma.mataPelajaran.findUnique({
                where: { id: updateBankSoalDto.mataPelajaranId },
            });
            if (!mataPelajaran) {
                throw new NotFoundException('Mata pelajaran tidak ditemukan');
            }
        }

        return this.prisma.bankSoal.update({
            where: { id },
            data: updateBankSoalDto,
            include: {
                mataPelajaran: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id); // Check if exists

        // Soft delete
        return this.prisma.bankSoal.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async generateKode(): Promise<string> {
        const prefix = 'SOAL';
        const count = await this.prisma.bankSoal.count();
        const number = (count + 1).toString().padStart(5, '0');
        return `${prefix}-${number}`;
    }

    async bulkImport(soalList: any[], mataPelajaranId?: string) {
        const results: {
            success: any[];
            failed: any[];
        } = {
            success: [],
            failed: [],
        };

        for (const soalData of soalList) {
            try {
                // Generate unique kode
                const kode = await this.generateKode();

                // Prepare data
                const data: any = {
                    kode,
                    pertanyaan: soalData.pertanyaan,
                    tipe: soalData.tipe || 'PILIHAN_GANDA',
                    bobot: soalData.bobot || 1,
                };

                if (mataPelajaranId) {
                    data.mataPelajaranId = mataPelajaranId;
                }

                if (soalData.pilihanJawaban) {
                    data.pilihanJawaban = soalData.pilihanJawaban;
                }

                if (soalData.jawabanBenar) {
                    data.jawabanBenar = soalData.jawabanBenar;
                }


                // Create
                const created = await this.prisma.bankSoal.create({
                    data,
                    include: {
                        mataPelajaran: true,
                    },
                });

                results.success.push(created);
            } catch (error) {
                results.failed.push({
                    soal: soalData,
                    error: error.message,
                });
            }
        }

        return results;
    }
}
