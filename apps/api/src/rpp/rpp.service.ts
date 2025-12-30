import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRppDto, UpdateRppDto, QueryRppDto } from './dto/rpp.dto';
import { Prisma, StatusRPP } from '@prisma/client';

@Injectable()
export class RppService {
    constructor(private prisma: PrismaService) { }

    async create(guruId: string, createRppDto: CreateRppDto) {
        const { kelasIds, ...rppData } = createRppDto;

        // Check if kode already exists
        const existingRpp = await this.prisma.rPP.findUnique({
            where: { kode: rppData.kode },
        });

        if (existingRpp) {
            throw new BadRequestException('Kode RPP sudah digunakan');
        }

        // Create RPP
        const rpp = await this.prisma.rPP.create({
            data: {
                ...rppData,
                guruId,
                status: rppData.isPublished ? StatusRPP.PUBLISHED : StatusRPP.DRAFT,
                tujuanPembelajaran: rppData.tujuanPembelajaran as Prisma.JsonArray,
                dimensiProfilLulusan: (rppData.dimensiProfilLulusan as Prisma.JsonArray) || null,
                kegiatanAwal: rppData.kegiatanAwal as Prisma.JsonObject | null,
                kegiatanMemahami: rppData.kegiatanMemahami as Prisma.JsonObject | null,
                kegiatanMengaplikasi: rppData.kegiatanMengaplikasi as Prisma.JsonObject | null,
                kegiatanMerefleksi: rppData.kegiatanMerefleksi as Prisma.JsonObject | null,
                kegiatanPenutup: rppData.kegiatanPenutup as Prisma.JsonObject | null,
            },
            include: {
                mataPelajaran: true,
                guru: true,
            },
        });

        // Add class relationships if kelasIds provided
        if (kelasIds && kelasIds.length > 0) {
            await this.prisma.rPPKelas.createMany({
                data: kelasIds.map((kelasId) => ({
                    rppId: rpp.id,
                    kelasId,
                })),
            });
        }

        return this.findOne(rpp.id);
    }

    async findAll(filters: QueryRppDto = {}) {
        const {
            mataPelajaranId,
            kelasId,
            guruId,
            status,
            search,
            page = 1,
            limit = 20
        } = filters;

        const where: Prisma.RPPWhereInput = {
            deletedAt: null,
        };

        if (mataPelajaranId) {
            where.mataPelajaranId = mataPelajaranId;
        }

        if (guruId) {
            where.guruId = guruId;
        }

        if (status) {
            where.status = status as StatusRPP;
        }

        if (kelasId) {
            where.rppKelas = {
                some: {
                    kelasId,
                },
            };
        }

        if (search) {
            where.OR = [
                { materi: { contains: search, mode: 'insensitive' } },
                { kode: { contains: search, mode: 'insensitive' } },
                { topikPembelajaran: { contains: search, mode: 'insensitive' } },
            ];
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.rPP.findMany({
                where,
                skip,
                take: limit,
                include: {
                    mataPelajaran: true,
                    guru: {
                        select: {
                            id: true,
                            nama: true,
                            nip: true,
                        },
                    },
                    rppKelas: {
                        include: {
                            kelas: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.rPP.count({ where }),
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
        const rpp = await this.prisma.rPP.findUnique({
            where: { id },
            include: {
                mataPelajaran: true,
                guru: {
                    select: {
                        id: true,
                        nama: true,
                        nip: true,
                        email: true,
                    },
                },
                rppKelas: {
                    include: {
                        kelas: {
                            include: {
                                jurusan: true,
                            },
                        },
                    },
                },
            },
        });

        if (!rpp || rpp.deletedAt) {
            throw new NotFoundException('RPP tidak ditemukan');
        }

        return rpp;
    }

    async update(id: string, guruId: string, updateRppDto: UpdateRppDto, isAdmin = false) {
        const existingRpp = await this.findOne(id);

        // Authorization check
        if (!isAdmin && existingRpp.guruId !== guruId) {
            throw new ForbiddenException('Anda tidak memiliki akses untuk mengubah RPP ini');
        }

        const { kelasIds, ...rppData } = updateRppDto;

        // Check if kode is being updated and already exists
        if (rppData.kode && rppData.kode !== existingRpp.kode) {
            const duplicateKode = await this.prisma.rPP.findUnique({
                where: { kode: rppData.kode },
            });

            if (duplicateKode) {
                throw new BadRequestException('Kode RPP sudah digunakan');
            }
        }

        // Build update data dynamically
        const updateData: any = {};

        Object.keys(rppData).forEach(key => {
            const value = (rppData as any)[key];
            if (value !== undefined) {
                if (key === 'tujuanPembelajaran' || key === 'dimensiProfilLulusan') {
                    updateData[key] = value as Prisma.JsonArray;
                } else if (key === 'kegiatanAwal' || key === 'kegiatanMemahami' ||
                    key === 'kegiatanMengaplikasi' || key === 'kegiatanMerefleksi' ||
                    key === 'kegiatanPenutup') {
                    updateData[key] = value as Prisma.JsonObject | null;
                } else if (key === 'isPublished' && value !== undefined) {
                    updateData.isPublished = value;
                    updateData.status = value ? StatusRPP.PUBLISHED : StatusRPP.DRAFT;
                } else {
                    updateData[key] = value;
                }
            }
        });

        await this.prisma.rPP.update({
            where: { id },
            data: updateData,
        });

        // Update class relationships if kelasIds provided
        if (kelasIds !== undefined) {
            // Delete existing relationships
            await this.prisma.rPPKelas.deleteMany({
                where: { rppId: id },
            });

            // Create new relationships
            if (kelasIds.length > 0) {
                await this.prisma.rPPKelas.createMany({
                    data: kelasIds.map((kelasId) => ({
                        rppId: id,
                        kelasId,
                    })),
                });
            }
        }

        return this.findOne(id);
    }

    async remove(id: string, guruId: string, isAdmin = false) {
        const existingRpp = await this.findOne(id);

        // Authorization check
        if (!isAdmin && existingRpp.guruId !== guruId) {
            throw new ForbiddenException('Anda tidak memiliki akses untuk menghapus RPP ini');
        }

        // Soft delete
        await this.prisma.rPP.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return { message: 'RPP berhasil dihapus' };
    }

    async publish(id: string, guruId: string, isAdmin = false) {
        const existingRpp = await this.findOne(id);

        // Authorization check
        if (!isAdmin && existingRpp.guruId !== guruId) {
            throw new ForbiddenException('Anda tidak memiliki akses untuk mempublikasi RPP ini');
        }

        await this.prisma.rPP.update({
            where: { id },
            data: {
                status: StatusRPP.PUBLISHED,
                isPublished: true,
            },
        });

        return this.findOne(id);
    }

    async duplicate(id: string, guruId: string) {
        const originalRpp = await this.findOne(id);

        // Generate new unique code
        const timestamp = Date.now();
        const newKode = `${originalRpp.kode}-COPY-${timestamp}`;

        // Get class IDs from original RPP
        const kelasIds = originalRpp.rppKelas?.map((rk) => rk.kelasId) || [];

        const createDto: CreateRppDto = {
            kode: newKode,
            namaGuru: originalRpp.namaGuru || undefined,
            mataPelajaranId: originalRpp.mataPelajaranId,
            materi: `[SALINAN] ${originalRpp.materi}`,
            fase: originalRpp.fase || undefined,
            alokasiWaktu: originalRpp.alokasiWaktu,
            tahunAjaran: originalRpp.tahunAjaran || undefined,

            identifikasiPesertaDidik: originalRpp.identifikasiPesertaDidik || undefined,
            identifikasiMateri: originalRpp.identifikasiMateri || undefined,
            dimensiProfilLulusan: (originalRpp.dimensiProfilLulusan as string[]) || undefined,

            capaianPembelajaran: originalRpp.capaianPembelajaran,
            lintasDisiplinIlmu: originalRpp.lintasDisiplinIlmu || undefined,
            tujuanPembelajaran: originalRpp.tujuanPembelajaran as string[],
            topikPembelajaran: originalRpp.topikPembelajaran,
            praktikPedagogik: originalRpp.praktikPedagogik || undefined,
            kemitraanPembelajaran: originalRpp.kemitraanPembelajaran || undefined,
            lingkunganPembelajaran: originalRpp.lingkunganPembelajaran || undefined,
            pemanfaatanDigital: originalRpp.pemanfaatanDigital || undefined,

            kegiatanAwal: (originalRpp.kegiatanAwal as any) || undefined,
            kegiatanMemahami: (originalRpp.kegiatanMemahami as any) || undefined,
            kegiatanMengaplikasi: (originalRpp.kegiatanMengaplikasi as any) || undefined,
            kegiatanMerefleksi: (originalRpp.kegiatanMerefleksi as any) || undefined,
            kegiatanPenutup: (originalRpp.kegiatanPenutup as any) || undefined,

            asesmenAwal: originalRpp.asesmenAwal || undefined,
            asesmenProses: originalRpp.asesmenProses || undefined,
            asesmenAkhir: originalRpp.asesmenAkhir || undefined,

            kelasIds,
            isPublished: false,
        };

        return this.create(guruId, createDto);
    }

    async getStats(guruId?: string) {
        const where: Prisma.RPPWhereInput = {
            deletedAt: null,
        };

        if (guruId) {
            where.guruId = guruId;
        }

        const [total, draft, published, archived] = await Promise.all([
            this.prisma.rPP.count({ where }),
            this.prisma.rPP.count({ where: { ...where, status: StatusRPP.DRAFT } }),
            this.prisma.rPP.count({ where: { ...where, status: StatusRPP.PUBLISHED } }),
            this.prisma.rPP.count({ where: { ...where, status: StatusRPP.ARCHIVED } }),
        ]);

        return {
            total,
            draft,
            published,
            archived,
        };
    }
}
