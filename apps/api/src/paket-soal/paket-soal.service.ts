import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaketSoalDto } from './dto/create-paket-soal.dto';
import { UpdatePaketSoalDto } from './dto/update-paket-soal.dto';
import { FilterPaketSoalDto } from './dto/filter-paket-soal.dto';
import { AddSoalDto } from './dto/add-soal.dto';
import * as mammoth from 'mammoth';

@Injectable()
export class PaketSoalService {
    constructor(private prisma: PrismaService) { }

    async create(createPaketSoalDto: CreatePaketSoalDto) {
        // Check if kode already exists
        const existing = await this.prisma.paketSoal.findUnique({
            where: { kode: createPaketSoalDto.kode },
        });

        if (existing) {
            throw new ConflictException(`Kode paket soal ${createPaketSoalDto.kode} sudah digunakan`);
        }

        return this.prisma.paketSoal.create({
            data: createPaketSoalDto,
            include: {
                mataPelajaran: true,
                guru: true,
                _count: {
                    select: { soalItems: true },
                },
            },
        });
    }

    async findAll(filterDto: FilterPaketSoalDto) {
        const { search, mataPelajaranId, page = 1, limit = 10 } = filterDto;
        const skip = (page - 1) * limit;

        const where: any = {
            deletedAt: null,
        };

        if (search) {
            where.OR = [
                { kode: { contains: search, mode: 'insensitive' } },
                { nama: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (mataPelajaranId) {
            where.mataPelajaranId = mataPelajaranId;
        }

        const [data, total] = await Promise.all([
            this.prisma.paketSoal.findMany({
                where,
                skip,
                take: limit,
                include: {
                    mataPelajaran: true,
                    guru: true,
                    _count: {
                        select: { soalItems: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.paketSoal.count({ where }),
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
        const paketSoal = await this.prisma.paketSoal.findUnique({
            where: { id, deletedAt: null },
            include: {
                mataPelajaran: true,
                soalItems: {
                    include: {
                        bankSoal: true,
                    },
                    orderBy: { urutan: 'asc' },
                },
                _count: {
                    select: { soalItems: true },
                },
            },
        });

        if (!paketSoal) {
            throw new NotFoundException('Paket soal tidak ditemukan');
        }

        return paketSoal;
    }

    async update(id: string, updatePaketSoalDto: UpdatePaketSoalDto) {
        await this.findOne(id); // Check if exists

        if (updatePaketSoalDto.kode) {
            const existing = await this.prisma.paketSoal.findFirst({
                where: {
                    kode: updatePaketSoalDto.kode,
                    id: { not: id },
                },
            });

            if (existing) {
                throw new ConflictException(`Kode paket soal ${updatePaketSoalDto.kode} sudah digunakan`);
            }
        }

        return this.prisma.paketSoal.update({
            where: { id },
            data: updatePaketSoalDto,
            include: {
                mataPelajaran: true,
                _count: {
                    select: { soalItems: true },
                },
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id); // Check if exists

        return this.prisma.paketSoal.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async generateKode(): Promise<string> {
        const prefix = 'PKT';
        const count = await this.prisma.paketSoal.count();
        const number = (count + 1).toString().padStart(5, '0');
        return `${prefix}-${number}`;
    }

    async addSoal(id: string, addSoalDto: AddSoalDto) {
        await this.findOne(id); // Check if paket exists

        // Get current max urutan
        const maxUrutan = await this.prisma.paketSoalItem.findFirst({
            where: { paketSoalId: id },
            orderBy: { urutan: 'desc' },
            select: { urutan: true },
        });

        let currentUrutan = maxUrutan?.urutan || 0;

        // Add each soal
        const items = await Promise.all(
            addSoalDto.bankSoalIds.map(async (bankSoalId) => {
                currentUrutan++;
                return this.prisma.paketSoalItem.create({
                    data: {
                        paketSoalId: id,
                        bankSoalId,
                        urutan: currentUrutan,
                    },
                    include: {
                        bankSoal: true,
                    },
                });
            })
        );

        // Update totalSoal
        await this.updateTotalSoal(id);

        return items;
    }

    async removeSoal(id: string, itemId: string) {
        const item = await this.prisma.paketSoalItem.findUnique({
            where: { id: itemId },
        });

        if (!item || item.paketSoalId !== id) {
            throw new NotFoundException('Soal tidak ditemukan dalam paket');
        }

        await this.prisma.paketSoalItem.delete({
            where: { id: itemId },
        });

        // Update totalSoal
        await this.updateTotalSoal(id);

        return { message: 'Soal berhasil dihapus dari paket' };
    }

    async importSoal(paketSoalId: string, file: Express.Multer.File, mataPelajaranId?: string) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        // Verify paket exists
        await this.findOne(paketSoalId);

        // Parse Word file
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        const text = result.value;

        // Parse questions using same format as bank-soal
        const soalList = this.parseWordContent(text);

        const results: {
            success: any[];
            failed: any[];
        } = {
            success: [],
            failed: [],
        };

        const bankSoalIds: string[] = [];

        for (const soalData of soalList) {
            try {
                // Generate unique kode for bank soal
                const kode = await this.generateBankSoalKode();

                // Prepare data
                const data: any = {
                    kode,
                    pertanyaan: soalData.pertanyaan,
                    tipe: soalData.tipe,
                    bobot: soalData.bobot,
                    mataPelajaranId: mataPelajaranId || soalData.mataPelajaranId,
                };

                if (soalData.pilihanJawaban) {
                    data.pilihanJawaban = soalData.pilihanJawaban;
                }

                if (soalData.jawabanBenar) {
                    data.jawabanBenar = soalData.jawabanBenar;
                }

                if (soalData.penjelasan) {
                    data.penjelasan = soalData.penjelasan;
                }

                // Create in bank soal
                const created = await this.prisma.bankSoal.create({
                    data,
                    include: {
                        mataPelajaran: true,
                    },
                });

                bankSoalIds.push(created.id);
                results.success.push(created);
            } catch (error) {
                results.failed.push({
                    soal: soalData,
                    error: error.message,
                });
            }
        }

        // Add all successfully created soal to paket
        if (bankSoalIds.length > 0) {
            await this.addSoal(paketSoalId, { bankSoalIds });
        }

        return {
            ...results,
            addedToPackage: bankSoalIds.length,
        };
    }

    private async generateBankSoalKode(): Promise<string> {
        const prefix = 'SOAL';
        const count = await this.prisma.bankSoal.count();
        const number = (count + 1).toString().padStart(5, '0');
        return `${prefix}-${number}`;
    }

    private parseWordContent(text: string): any[] {
        const soalList: any[] = [];
        const soalBlocks = text.split(/\[NOMOR \d+\]/i).filter(block => block.trim());

        for (const block of soalBlocks) {
            try {
                const lines = block.split('\n').map(line => line.trim()).filter(line => line);

                let jenisSoal = 'PILIHAN_GANDA';
                let nilai = 10;
                let pertanyaan = '';
                let jawaban: any[] = [];
                let kunciJawaban = '';

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];

                    if (line.match(/^JENIS SOAL:/i)) {
                        const match = line.match(/JENIS SOAL:\s*(.+)/i);
                        if (match) {
                            const jenis = match[1].trim().toUpperCase();
                            if (jenis.includes('PILIHAN GANDA') || jenis.includes('PG')) {
                                jenisSoal = 'PILIHAN_GANDA';
                            } else if (jenis.includes('ESSAY')) {
                                jenisSoal = 'ESSAY';
                            } else if (jenis.includes('BENAR') || jenis.includes('SALAH')) {
                                jenisSoal = 'BENAR_SALAH';
                            } else if (jenis.includes('ISIAN')) {
                                jenisSoal = 'ISIAN_SINGKAT';
                            }
                        }
                    } else if (line.match(/^NILAI:/i)) {
                        const match = line.match(/NILAI:\s*(\d+)/i);
                        if (match) nilai = parseInt(match[1]);
                    } else if (line.match(/^SOAL:/i)) {
                        pertanyaan = line.replace(/^SOAL:/i, '').trim();
                        // Collect multi-line question
                        while (i + 1 < lines.length && !lines[i + 1].match(/^(JAWABAN|KUNCI JAWABAN):/i)) {
                            i++;
                            pertanyaan += ' ' + lines[i];
                        }
                    } else if (line.match(/^JAWABAN:/i)) {
                        // Collect all answer options (with or without A./B./C. prefix)
                        const optionLabels = ['A', 'B', 'C', 'D', 'E'];
                        let optionIndex = 0;

                        while (i + 1 < lines.length && !lines[i + 1].match(/^KUNCI JAWABAN:/i)) {
                            i++;
                            const answerLine = lines[i]; // keep original text to avoid trimming first letter
                            if (!answerLine) continue;

                            const optionMatch = answerLine.match(/^([A-E])[\.\)]\s*(.+)/);

                            let optionId = optionLabels[optionIndex] || `${optionIndex + 1}`;
                            let optionText = answerLine;

                            if (optionMatch) {
                                optionId = optionMatch[1].toUpperCase();
                                optionText = optionMatch[2];

                                const matchedIndex = optionLabels.indexOf(optionId);
                                if (matchedIndex >= 0) {
                                    optionIndex = matchedIndex;
                                }
                            }
                            jawaban.push({
                                id: optionId,
                                text: optionText,
                                isCorrect: false,
                            });

                            optionIndex++;
                        }
                    } else if (line.match(/^KUNCI JAWABAN:/i)) {
                        const match = line.match(/KUNCI JAWABAN:\s*([A-E])/i);
                        if (match) kunciJawaban = match[1].toUpperCase();
                    }
                }

                // Mark correct answer
                if (kunciJawaban && jawaban.length > 0) {
                    const correctAnswer = jawaban.find(j => j.id === kunciJawaban);
                    if (correctAnswer) {
                        correctAnswer.isCorrect = true;
                    }
                }

                if (pertanyaan) {
                    soalList.push({
                        pertanyaan,
                        tipe: jenisSoal,
                        bobot: nilai,
                        pilihanJawaban: jawaban.length > 0 ? jawaban : null,
                        jawabanBenar: kunciJawaban || null,
                    });
                }
            } catch (error) {
                console.error('Error parsing soal block:', error);
            }
        }

        return soalList;
    }

    private async updateTotalSoal(paketSoalId: string) {
        const count = await this.prisma.paketSoalItem.count({
            where: { paketSoalId },
        });

        await this.prisma.paketSoal.update({
            where: { id: paketSoalId },
            data: { totalSoal: count },
        });
    }
}
