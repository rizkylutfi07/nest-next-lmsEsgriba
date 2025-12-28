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

        const { kelasIds, ...paketData } = createPaketSoalDto;

        return this.prisma.paketSoal.create({
            data: {
                ...paketData,
                paketSoalKelas: kelasIds && kelasIds.length > 0 ? {
                    create: kelasIds.map(kelasId => ({ kelasId }))
                } : undefined,
            },
            include: {
                mataPelajaran: true,
                guru: true,
                paketSoalKelas: {
                    include: { kelas: true }
                },
                _count: {
                    select: { soalItems: true },
                },
            },
        });
    }

    async findAll(filterDto: FilterPaketSoalDto) {
        const { search, mataPelajaranId, guruId, page = 1, limit = 10 } = filterDto;
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

        if (guruId) {
            where.guruId = guruId;
        }

        const [data, total] = await Promise.all([
            this.prisma.paketSoal.findMany({
                where,
                skip,
                take: limit,
                include: {
                    mataPelajaran: true,
                    guru: true,
                    paketSoalKelas: {
                        include: { kelas: true }
                    },
                    soalItems: {
                        include: {
                            bankSoal: {
                                select: { bobot: true },
                            },
                        },
                    },
                    _count: {
                        select: { soalItems: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.paketSoal.count({ where }),
        ]);

        // Calculate total point for each paket
        const dataWithTotalPoint = data.map((paket) => ({
            ...paket,
            totalPoint: paket.soalItems.reduce((sum, item) => sum + (item.bankSoal?.bobot || 0), 0),
        }));

        return {
            data: dataWithTotalPoint,
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
                guru: true,
                paketSoalKelas: {
                    include: { kelas: true }
                },
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

        const { kelasIds, ...paketData } = updatePaketSoalDto;

        // If kelasIds is provided, update the many-to-many relation
        if (kelasIds !== undefined) {
            // Delete existing relations
            await this.prisma.paketSoalKelas.deleteMany({
                where: { paketSoalId: id }
            });

            // Create new relations if kelasIds is not empty
            if (kelasIds.length > 0) {
                await this.prisma.paketSoalKelas.createMany({
                    data: kelasIds.map(kelasId => ({
                        paketSoalId: id,
                        kelasId
                    }))
                });
            }
        }

        return this.prisma.paketSoal.update({
            where: { id },
            data: paketData,
            include: {
                mataPelajaran: true,
                guru: true,
                paketSoalKelas: {
                    include: { kelas: true }
                },
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

    /**
     * Preview import - parse Word file and return validation results without saving
     */
    async previewImport(paketSoalId: string, file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        // Verify paket exists
        await this.findOne(paketSoalId);

        // Parse Word file - get both raw text and HTML (for image detection)
        const textResult = await mammoth.extractRawText({ buffer: file.buffer });
        const htmlResult = await mammoth.convertToHtml({ buffer: file.buffer });

        // Parse questions from raw text
        const soalBlocks = textResult.value.split(/\[NOMOR \d+\]/i).filter(block => block.trim());

        const validSoal: any[] = [];
        const invalidSoal: any[] = [];
        let totalBobot = 0;

        // Pre-compute all NOMOR marker positions in HTML (handles duplicate markers)
        const htmlMarkerPositions: { marker: string, index: number }[] = [];
        const markerRegex = /\[NOMOR\s+\d+\]/gi;
        let markerMatch;
        while ((markerMatch = markerRegex.exec(htmlResult.value)) !== null) {
            htmlMarkerPositions.push({ marker: markerMatch[0], index: markerMatch.index });
        }

        for (let blockIndex = 0; blockIndex < soalBlocks.length; blockIndex++) {
            const block = soalBlocks[blockIndex];
            const nomorSoal = blockIndex + 1;
            const issues: string[] = [];

            try {
                const lines = block.split('\n').map(line => line.trim()).filter(line => line);

                let jenisSoal = '';
                let nilai = 0;
                let pertanyaan = '';
                let jawaban: string[] = [];
                let kunciJawaban = '';
                let hasImageInSoal = false;
                let hasImageInJawaban = false;

                // Find HTML section using index position (handles duplicate NOMOR markers)
                // htmlMarkerPositions is computed once outside the loop
                if (htmlMarkerPositions[blockIndex]) {
                    const start = htmlMarkerPositions[blockIndex].index;
                    const end = htmlMarkerPositions[blockIndex + 1]
                        ? htmlMarkerPositions[blockIndex + 1].index
                        : htmlResult.value.length;
                    const htmlSection = htmlResult.value.substring(start, end);

                    // Check for images in this section
                    if (htmlSection.includes('<img')) {
                        // Check if image is in SOAL section (before JAWABAN)
                        const jawabanIndex = htmlSection.search(/JAWABAN:/i);
                        const imgIndex = htmlSection.indexOf('<img');
                        if (jawabanIndex === -1 || imgIndex < jawabanIndex) {
                            hasImageInSoal = true;
                        }
                        if (jawabanIndex !== -1 && htmlSection.indexOf('<img', jawabanIndex) !== -1) {
                            hasImageInJawaban = true;
                        }
                    }
                }

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
                        while (i + 1 < lines.length && !lines[i + 1].match(/^(JAWABAN|KUNCI JAWABAN):/i)) {
                            i++;
                            pertanyaan += '\n' + lines[i];
                        }
                    } else if (line.match(/^JAWABAN:/i)) {
                        while (i + 1 < lines.length && !lines[i + 1].match(/^KUNCI JAWABAN:/i)) {
                            i++;
                            if (lines[i]) jawaban.push(lines[i]);
                        }
                    } else if (line.match(/^KUNCI JAWABAN:/i)) {
                        // For multiple choice, extract letter (A-E)
                        // For essay, extract full text answer
                        if (jenisSoal === 'PILIHAN_GANDA' || jenisSoal === 'BENAR_SALAH') {
                            const match = line.match(/KUNCI JAWABAN:\s*([A-E])/i);
                            if (match) kunciJawaban = match[1].toUpperCase();
                        } else if (jenisSoal === 'ESSAY' || jenisSoal === 'ISIAN_SINGKAT') {
                            // For essay/short answer, capture multi-line answer
                            kunciJawaban = line.replace(/^KUNCI JAWABAN:/i, '').trim();
                            // Collect multi-line answer until end of block
                            while (i + 1 < lines.length && !lines[i + 1].match(/^\[NOMOR/i)) {
                                i++;
                                if (lines[i].trim()) {
                                    kunciJawaban += ' ' + lines[i].trim();
                                }
                            }
                        }
                    }
                }

                // Validate
                if (!jenisSoal) issues.push('Jenis soal tidak ditemukan');
                if (nilai <= 0) issues.push('Nilai/bobot tidak valid');

                // Check pertanyaan - but allow if there's an image
                if (!pertanyaan || pertanyaan.length < 5) {
                    if (!hasImageInSoal) {
                        issues.push('Pertanyaan kosong atau terlalu pendek');
                    }
                }

                if (jenisSoal === 'PILIHAN_GANDA' || jenisSoal === 'BENAR_SALAH') {
                    // Allow fewer text options if there are images in jawaban
                    if (jawaban.length < 2 && !hasImageInJawaban) {
                        issues.push('Pilihan jawaban kurang dari 2');
                    }
                    if (!kunciJawaban) issues.push('Kunci jawaban tidak ditemukan');
                } else if (jenisSoal === 'ESSAY' || jenisSoal === 'ISIAN_SINGKAT') {
                    // For essay, kunci jawaban is optional but recommended
                    if (!kunciJawaban) issues.push('Kunci jawaban/rubrik tidak ditemukan (opsional)');
                }

                const soalData = {
                    nomor: nomorSoal,
                    jenisSoal: jenisSoal || 'TIDAK DIKETAHUI',
                    bobot: nilai,
                    pertanyaanPreview: hasImageInSoal
                        ? (pertanyaan ? pertanyaan.substring(0, 80) + ' [+ GAMBAR]' : '[GAMBAR]')
                        : (pertanyaan.substring(0, 100) + (pertanyaan.length > 100 ? '...' : '')),
                    jumlahPilihan: jawaban.length,
                    kunciJawaban: kunciJawaban || '-',
                    hasImage: hasImageInSoal || hasImageInJawaban,
                    issues,
                };

                if (issues.length === 0) {
                    validSoal.push(soalData);
                    totalBobot += nilai;
                } else {
                    invalidSoal.push(soalData);
                }
            } catch (error) {
                invalidSoal.push({
                    nomor: nomorSoal,
                    jenisSoal: 'ERROR',
                    bobot: 0,
                    pertanyaanPreview: 'Error parsing soal',
                    jumlahPilihan: 0,
                    kunciJawaban: '-',
                    hasImage: false,
                    issues: ['Error parsing: ' + (error as Error).message],
                });
            }
        }

        return {
            totalSoal: soalBlocks.length,
            validCount: validSoal.length,
            invalidCount: invalidSoal.length,
            totalBobot,
            validSoal,
            invalidSoal,
            nomorBermasalah: invalidSoal.map(s => s.nomor),
        };
    }

    async importSoal(paketSoalId: string, file: Express.Multer.File, mataPelajaranId?: string) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        // Verify paket exists
        await this.findOne(paketSoalId);

        // Parse Word file with HTML and custom image handler (embeds images as base64)
        const imageHandler = mammoth.images.imgElement(function (image) {
            return image.read("base64").then(function (imageBuffer) {
                return {
                    src: "data:" + image.contentType + ";base64," + imageBuffer
                };
            });
        });

        const htmlResult = await mammoth.convertToHtml(
            { buffer: file.buffer },
            { convertImage: imageHandler }
        );
        const html = htmlResult.value;

        // Parse questions from HTML (with images)
        const soalList = this.parseHtmlContent(html);

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

    /**
     * Parse HTML content from mammoth to extract questions with images
     */
    private parseHtmlContent(html: string): any[] {
        const soalList: any[] = [];

        // Split by [NOMOR x] pattern and filter out blocks without question content
        const blocks = html.split(/\[NOMOR\s+\d+\]/i)
            .filter(block => block.trim())
            .filter(block => /JENIS SOAL:/i.test(block)); // Only blocks with actual questions

        for (let blockIdx = 0; blockIdx < blocks.length; blockIdx++) {
            const block = blocks[blockIdx];

            try {
                // Strip HTML tags but preserve img tags
                let workingBlock = block;

                // Extract and parse sections from HTML
                let jenisSoal = 'PILIHAN_GANDA';
                let nilai = 10;
                let pertanyaan = '';
                let jawaban: any[] = [];
                let kunciJawaban = '';

                // Parse JENIS SOAL
                const jenisMatch = workingBlock.match(/JENIS SOAL:\s*([^<\n]+)/i);
                if (jenisMatch) {
                    const jenis = jenisMatch[1].trim().toUpperCase();
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

                // Parse NILAI
                const nilaiMatch = workingBlock.match(/NILAI:\s*(\d+)/i);
                if (nilaiMatch) {
                    nilai = parseInt(nilaiMatch[1]);
                }

                // Extract SOAL section (between SOAL: and JAWABAN:)
                const soalMatch = workingBlock.match(/SOAL:([\s\S]*?)(?:JAWABAN:|KUNCI JAWABAN:|$)/i);
                if (soalMatch) {
                    pertanyaan = this.cleanHtmlContent(soalMatch[1]);
                }

                // Extract JAWABAN section
                const jawabanMatch = workingBlock.match(/JAWABAN:([\s\S]*?)(?:KUNCI JAWABAN:|$)/i);
                if (jawabanMatch) {
                    const jawabanHtml = jawabanMatch[1];
                    jawaban = this.parseAnswerOptions(jawabanHtml);
                }

                // Extract KUNCI JAWABAN
                if (jenisSoal === 'PILIHAN_GANDA' || jenisSoal === 'BENAR_SALAH') {
                    const kunciMatch = workingBlock.match(/KUNCI JAWABAN:\s*([A-E])/i);
                    if (kunciMatch) {
                        kunciJawaban = kunciMatch[1].toUpperCase();
                    }
                } else if (jenisSoal === 'ESSAY' || jenisSoal === 'ISIAN_SINGKAT') {
                    // For essay, extract full text answer
                    const kunciMatch = workingBlock.match(/KUNCI JAWABAN:([\s\S]*?)(?:<p>\[NOMOR|$)/i);
                    if (kunciMatch) {
                        kunciJawaban = this.cleanHtmlContent(kunciMatch[1]).trim();
                    }
                }

                // Mark correct answer for multiple choice questions
                if (kunciJawaban && jawaban.length > 0 && (jenisSoal === 'PILIHAN_GANDA' || jenisSoal === 'BENAR_SALAH')) {
                    const correctAnswer = jawaban.find(j => j.id === kunciJawaban);
                    if (correctAnswer) {
                        correctAnswer.isCorrect = true;
                        console.log(`✓ Marked option ${kunciJawaban} as correct`);
                    } else {
                        console.log(`⚠️ Could not find option ${kunciJawaban} to mark as correct`);
                    }
                }

                const soal = {
                    pertanyaan: pertanyaan || '[Soal dengan gambar]',
                    tipe: jenisSoal,
                    bobot: nilai,
                    pilihanJawaban: jawaban.length > 0 ? jawaban : null,
                    jawabanBenar: kunciJawaban || null,
                };

                console.log('✓ Soal added to list');
                console.log('Summary:', {
                    tipe: soal.tipe,
                    bobot: soal.bobot,
                    optionsCount: jawaban.length,
                    kunci: kunciJawaban
                });

                soalList.push(soal);
            } catch (error) {
                console.error('Error parsing HTML soal block:', error);
            }
        }

        return soalList;
    }

    /**
     * Clean HTML content - preserve img tags, strip other HTML
     */
    private cleanHtmlContent(html: string): string {
        if (!html) return '';

        // Preserve img tags by replacing them with placeholders
        const imgPlaceholders: string[] = [];
        let cleaned = html.replace(/<img[^>]+>/gi, (match) => {
            imgPlaceholders.push(match);
            return `__IMG_${imgPlaceholders.length - 1}__`;
        });

        // Strip other HTML tags
        cleaned = cleaned.replace(/<[^>]+>/g, ' ');

        // Restore img tags
        imgPlaceholders.forEach((img, i) => {
            cleaned = cleaned.replace(`__IMG_${i}__`, img);
        });

        // Clean up whitespace
        cleaned = cleaned.replace(/\s+/g, ' ').trim();

        // Remove question type and weight prefixes from the beginning of the text
        // Patterns like: "PG NILAI: 3 SOAL:", "PILIHAN GANDA NILAI: 5 SOAL:", etc.
        cleaned = cleaned.replace(/^(PG|PILIHAN GANDA|ESSAY|BENAR[\s-]?SALAH|ISIAN SINGKAT)\s*NILAI:\s*\d+\s*SOAL:\s*/i, '');

        // Also handle variations without "SOAL:" label
        cleaned = cleaned.replace(/^(PG|PILIHAN GANDA|ESSAY|BENAR[\s-]?SALAH|ISIAN SINGKAT)\s*NILAI:\s*\d+\s*:\s*/i, '');

        return cleaned.trim();
    }

    /**
     * Parse answer options from HTML, preserving images
     */
    private parseAnswerOptions(html: string): any[] {
        const options: any[] = [];
        const optionLabels = ['A', 'B', 'C', 'D', 'E'];

        // STRATEGY 1: Try parsing LI tags first (Word auto-numbering creates clean lists)
        const liMatches = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);

        if (liMatches && liMatches.length >= 4) {
            liMatches.forEach((li, i) => {
                if (i < optionLabels.length) {
                    // Remove LI tags and any leading A., B., etc that might be in the text
                    let text = li.replace(/<\/?li[^>]*>/gi, '');
                    text = this.cleanHtmlContent(text);

                    // Remove any leading A., B., C. pattern if present
                    text = text.replace(/^[A-E][\.)]\s*/i, '').trim();

                    options.push({
                        id: optionLabels[i],
                        text: text || '[Jawaban dengan gambar]',
                        isCorrect: false,
                    });
                }
            });
            return options;
        }

        // STRATEGY 2: Try regex-based parsing (manual A., B., C. format with line breaks)
        // Split by lines and try to match A., B., C. patterns
        const lines = html
            .replace(/<[^>]*>/g, ' ') // Strip all HTML tags
            .split(/\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

        for (const line of lines) {
            // Match patterns: A. text, A) text, or just A text at start of line
            const optionMatch = line.match(/^([A-E])[\.)]\s*(.+)/i);

            if (optionMatch) {
                const label = optionMatch[1].toUpperCase();
                const text = optionMatch[2].trim();

                // Only add if not duplicate
                if (!options.find(opt => opt.id === label)) {
                    options.push({
                        id: label,
                        text: text || '[Jawaban dengan gambar]',
                        isCorrect: false,
                    });
                }
            }
        }

        // If we found options with Strategy 2, return them
        if (options.length >= 2) {
            return options;
        }

        // STRATEGY 3: Handle inline options in a single line (e.g., "Word B.Excel C.PowerPoint D.Corel Draw E.Paint")
        // or "A.Word B.Excel C.PowerPoint D.Corel Draw E.Paint"
        const cleanText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

        // Pattern: Split by space followed by B., C., D., E. (with optional preceding A.)
        // This captures: "A.Word B.Excel C.PowerPoint..." or "Word B.Excel C.PowerPoint..."
        const inlinePattern = /(?:^A[\.)]?\s*)?(.+?)(?=\s+B[\.)]|\s*$)/i;
        const optionAMatch = cleanText.match(inlinePattern);

        if (optionAMatch) {
            // Split all options using regex lookahead
            // Match pattern: text before " B." or " C." etc
            const splitPattern = /\s+(?=[A-E][\.)])/gi;
            const parts = cleanText.split(splitPattern).filter(p => p.trim());

            if (parts.length >= 2) {
                options.length = 0; // Clear any previous attempts

                for (let i = 0; i < parts.length && i < optionLabels.length; i++) {
                    let part = parts[i].trim();

                    // Remove leading label like "A.", "B)" etc if present
                    part = part.replace(/^[A-E][\.)]\s*/i, '').trim();

                    if (part) {
                        options.push({
                            id: optionLabels[i],
                            text: part,
                            isCorrect: false,
                        });
                    }
                }

                if (options.length >= 2) {
                    return options;
                }
            }
        }

        return options;
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

        for (let blockIdx = 0; blockIdx < soalBlocks.length; blockIdx++) {
            const block = soalBlocks[blockIdx];
            console.log(`\n--- Processing Block ${blockIdx + 1}/${soalBlocks.length} ---`);
            console.log('Block preview:', block.substring(0, 200));

            try {
                const lines = block.split('\n').map(line => line.trim()).filter(line => line);
                console.log('Total lines in block:', lines.length);

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
                            console.log('JENIS SOAL detected:', jenis);
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
                        if (match) {
                            nilai = parseInt(match[1]);
                            console.log('NILAI detected:', nilai);
                        }
                    } else if (line.match(/^SOAL:/i)) {
                        pertanyaan = line.replace(/^SOAL:/i, '').trim();
                        // Collect multi-line question
                        while (i + 1 < lines.length && !lines[i + 1].match(/^(JAWABAN|KUNCI JAWABAN):/i)) {
                            i++;
                            pertanyaan += ' ' + lines[i];
                        }
                        console.log('PERTANYAAN:', pertanyaan.substring(0, 100));
                    } else if (line.match(/^JAWABAN:/i)) {
                        console.log('JAWABAN section found');

                        // Collect all answer options (with or without A./B./C. prefix)
                        const optionLabels = ['A', 'B', 'C', 'D', 'E'];
                        let optionIndex = 0;

                        while (i + 1 < lines.length && !lines[i + 1].match(/^KUNCI JAWABAN:/i)) {
                            i++;
                            const answerLine = lines[i]; // keep original text to avoid trimming first letter
                            if (!answerLine) continue;

                            console.log(`  Parsing answer line: "${answerLine}"`);

                            const optionMatch = answerLine.match(/^([A-E])[\.\)]\s*(.+)/);

                            let optionId = optionLabels[optionIndex] || `${optionIndex + 1}`;
                            let optionText = answerLine;

                            if (optionMatch) {
                                optionId = optionMatch[1].toUpperCase();
                                optionText = optionMatch[2];
                                console.log(`    ✓ Matched with prefix: ${optionId} -> "${optionText.substring(0, 50)}"`);
                            } else {
                                console.log(`    → Using plain text as option ${optionId}: "${optionText.substring(0, 50)}"`);
                            }

                            jawaban.push({
                                id: optionId,
                                text: optionText,
                                isCorrect: false,
                            });

                            optionIndex++;
                        }
                        console.log(`Total options collected: ${jawaban.length}`);
                    } else if (line.match(/^KUNCI JAWABAN:/i)) {
                        // For multiple choice, extract letter (A-E)
                        // For essay, extract full text answer
                        if (jenisSoal === 'PILIHAN_GANDA' || jenisSoal === 'BENAR_SALAH') {
                            const match = line.match(/KUNCI JAWABAN:\s*([A-E])/i);
                            if (match) {
                                kunciJawaban = match[1].toUpperCase();
                                console.log('KUNCI JAWABAN (PG):', kunciJawaban);
                            }
                        } else if (jenisSoal === 'ESSAY' || jenisSoal === 'ISIAN_SINGKAT') {
                            // For essay/short answer, capture multi-line answer
                            kunciJawaban = line.replace(/^KUNCI JAWABAN:/i, '').trim();
                            // Collect multi-line answer until end of block
                            while (i + 1 < lines.length && !lines[i + 1].match(/^\[NOMOR/i)) {
                                i++;
                                if (lines[i].trim()) {
                                    kunciJawaban += ' ' + lines[i].trim();
                                }
                            }
                            console.log('KUNCI JAWABAN (ESSAY):', kunciJawaban.substring(0, 100));
                        }
                    }
                }

                // Mark correct answer for multiple choice questions
                if (kunciJawaban && jawaban.length > 0 && (jenisSoal === 'PILIHAN_GANDA' || jenisSoal === 'BENAR_SALAH')) {
                    const correctAnswer = jawaban.find(j => j.id === kunciJawaban);
                    if (correctAnswer) {
                        correctAnswer.isCorrect = true;
                        console.log(`✓ Marked option ${kunciJawaban} as correct`);
                    } else {
                        console.log(`⚠️ Could not find option ${kunciJawaban} to mark as correct`);
                    }
                }

                const soal = {
                    pertanyaan: pertanyaan || '[Soal dengan gambar]',
                    tipe: jenisSoal,
                    bobot: nilai,
                    pilihanJawaban: jawaban.length > 0 ? jawaban : null,
                    jawabanBenar: kunciJawaban || null,
                };

                console.log('✓ Soal added to list');
                console.log('Summary:', {
                    tipe: soal.tipe,
                    bobot: soal.bobot,
                    optionsCount: jawaban.length,
                    kunci: kunciJawaban
                });

                soalList.push(soal);
            } catch (error) {
                console.error('❌ Error parsing soal block:', error);
            }
        }

        console.log('\n=== PARSING COMPLETE ===');
        console.log('Total soal parsed:', soalList.length);
        console.log('Soal list:', JSON.stringify(soalList, null, 2));

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
