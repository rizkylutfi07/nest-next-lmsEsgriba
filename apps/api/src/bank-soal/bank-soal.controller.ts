import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BankSoalService } from './bank-soal.service';
import { CreateBankSoalDto } from './dto/create-bank-soal.dto';
import { UpdateBankSoalDto } from './dto/update-bank-soal.dto';
import { FilterBankSoalDto } from './dto/filter-bank-soal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('bank-soal')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BankSoalController {
    constructor(private readonly bankSoalService: BankSoalService) { }

    @Post()
    @Roles(Role.ADMIN, Role.GURU)
    create(@Body() createBankSoalDto: CreateBankSoalDto) {
        return this.bankSoalService.create(createBankSoalDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.GURU)
    findAll(@Query() filterDto: FilterBankSoalDto) {
        return this.bankSoalService.findAll(filterDto);
    }

    @Get('generate-kode')
    @Roles(Role.ADMIN, Role.GURU)
    generateKode() {
        return this.bankSoalService.generateKode();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.GURU)
    findOne(@Param('id') id: string) {
        return this.bankSoalService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.GURU)
    update(@Param('id') id: string, @Body() updateBankSoalDto: UpdateBankSoalDto) {
        return this.bankSoalService.update(id, updateBankSoalDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.GURU)
    remove(@Param('id') id: string) {
        return this.bankSoalService.remove(id);
    }

    @Post('import')
    @Roles(Role.ADMIN, Role.GURU)
    bulkImport(@Body() body: { soal: any[]; mataPelajaranId?: string }) {
        return this.bankSoalService.bulkImport(body.soal, body.mataPelajaranId);
    }

    @Post('import/file')
    @Roles(Role.ADMIN, Role.GURU)
    @UseInterceptors(FileInterceptor('file'))
    async importFile(
        @UploadedFile() file: Express.Multer.File,
        @Body('mataPelajaranId') mataPelajaranId?: string,
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        let soalList: any[] = [];

        // Parse based on file type
        if (file.mimetype === 'application/json') {
            // JSON file
            const jsonData = JSON.parse(file.buffer.toString());
            soalList = Array.isArray(jsonData) ? jsonData : jsonData.soal || [];
        } else if (
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.mimetype === 'application/msword'
        ) {
            // Word file - parse using mammoth
            const mammoth = require('mammoth');
            const resultText = await mammoth.extractRawText({ buffer: file.buffer });
            const resultHtml = await mammoth.convertToHtml({ buffer: file.buffer });

            const text = resultText.value;
            const html = resultHtml.value;

            // Parse text format based on user's template:
            // [NOMOR X]
            // JENIS SOAL: PG/ESSAY
            // NILAI: X
            // SOAL:
            // ...pertanyaan...
            // JAWABAN:
            // ...pilihan...
            // KUNCI JAWABAN: A/B/C/D/E

            // Split by [NOMOR X] markers
            const soalBlocks = text.split(/\[NOMOR\s+\d+\]/).filter(block => block.trim());
            const htmlBlocks = html.split(/\[NOMOR\s+\d+\]/).filter((block: string) => block.trim());

            soalBlocks.forEach((block, blockIndex) => {
                const lines = block.split('\n').map(l => l.trim()).filter(l => l);
                if (lines.length === 0) {
                    return;
                }

                const soal: any = {
                    tipe: 'PILIHAN_GANDA',
                    bobot: 1,
                };

                let currentSection = '';
                let pertanyaan = '';
                let pertanyaanHtml = '';
                let jawaban: string[] = [];
                let kunciJawaban = '';

                for (const line of lines) {
                    // Check for section headers
                    if (line.startsWith('JENIS SOAL:')) {
                        const jenis = line.replace('JENIS SOAL:', '').trim();
                        if (jenis === 'PG') {
                            soal.tipe = 'PILIHAN_GANDA';
                        } else if (jenis === 'ESSAY') {
                            soal.tipe = 'ESSAY';
                        }
                        continue;
                    }

                    if (line.startsWith('NILAI:')) {
                        const nilai = line.replace('NILAI:', '').trim();
                        soal.bobot = parseInt(nilai) || 1;
                        continue;
                    }

                    if (line === 'SOAL:') {
                        currentSection = 'SOAL';
                        continue;
                    }

                    if (line === 'JAWABAN:') {
                        currentSection = 'JAWABAN';
                        continue;
                    }

                    if (line.startsWith('KUNCI JAWABAN:')) {
                        kunciJawaban = line.replace('KUNCI JAWABAN:', '').trim();
                        currentSection = '';
                        continue;
                    }

                    // Collect content based on current section
                    if (currentSection === 'SOAL') {
                        pertanyaan += (pertanyaan ? '\n' : '') + line;
                    } else if (currentSection === 'JAWABAN') {
                        if (line) {
                            jawaban.push(line);
                        }
                    }
                }

                // Extract formatted question HTML (keeps bold/paragraph from Word) if available
                if (htmlBlocks.length === soalBlocks.length) {
                    const htmlBlock = htmlBlocks[blockIndex] || '';
                    const afterSoalMarker = htmlBlock.split(/SOAL:/i)[1];
                    if (afterSoalMarker) {
                        const soalSection = afterSoalMarker.split(/JAWABAN:/i)[0] || afterSoalMarker.split(/KUNCI JAWABAN:/i)[0];
                        if (soalSection) {
                            // Convert HTML lists to numbered text format
                            pertanyaanHtml = this.processHtmlToText(soalSection);
                        }
                    }
                }

                // Set pertanyaan - prefer processed HTML which preserves list numbers
                if (pertanyaanHtml) {
                    soal.pertanyaan = pertanyaanHtml;
                } else if (pertanyaan) {
                    soal.pertanyaan = pertanyaan.trim();
                }

                // Process jawaban for multiple choice
                if (soal.tipe === 'PILIHAN_GANDA' && jawaban.length > 0) {
                    const pilihanJawaban: any[] = [];
                    const options = ['A', 'B', 'C', 'D', 'E'];

                    for (let i = 0; i < jawaban.length && i < 5; i++) {
                        pilihanJawaban.push({
                            id: options[i],
                            text: jawaban[i],
                            isCorrect: options[i] === kunciJawaban,
                        });
                    }

                    soal.pilihanJawaban = pilihanJawaban;
                } else if (soal.tipe === 'ESSAY' && kunciJawaban) {
                    // For essay, kunci jawaban is the explanation/rubric
                    soal.penjelasan = kunciJawaban;
                }

                // Only add if we have a valid question
                if (soal.pertanyaan) {
                    soalList.push(soal);
                }
            });
        } else {
            throw new BadRequestException('Unsupported file type. Please upload JSON or Word (.docx) file.');
        }

        return this.bankSoalService.bulkImport(soalList, mataPelajaranId);
    }

    @Get('template/word')
    @Roles(Role.ADMIN, Role.GURU)
    downloadTemplate() {
        // Create Word template content matching user's format
        const template = `TEMPLATE IMPORT SOAL - CBT

Format Penulisan:
Gunakan format berikut untuk setiap soal:

[NOMOR 1]

JENIS SOAL: PG

NILAI: 3

SOAL:

Apa ibukota Indonesia?

JAWABAN:

Jakarta

Bandung

Surabaya

Medan

Yogyakarta

KUNCI JAWABAN: A



[NOMOR 2]

JENIS SOAL: PG

NILAI: 3

SOAL:

Siapa presiden pertama Indonesia?

JAWABAN:

Soekarno

Soeharto

BJ Habibie

Megawati

Jokowi

KUNCI JAWABAN: A



[NOMOR 3]

JENIS SOAL: ESSAY

NILAI: 8

SOAL:

Jelaskan proses fotosintesis pada tumbuhan!

KUNCI JAWABAN:

Fotosintesis adalah proses pembuatan makanan oleh tumbuhan dengan bantuan sinar matahari. Prosesnya melibatkan klorofil, air, dan karbon dioksida untuk menghasilkan glukosa dan oksigen.



CATATAN PENTING:
- Setiap soal dimulai dengan [NOMOR X]
- JENIS SOAL: PG (Pilihan Ganda) atau ESSAY
- NILAI: Bobot soal (angka)
- SOAL: Pertanyaan soal
- JAWABAN: Untuk PG, tulis 5 pilihan (A-E), setiap pilihan di baris baru
- KUNCI JAWABAN: Untuk PG tulis huruf (A/B/C/D/E), untuk ESSAY tulis penjelasan/rubrik
- Pisahkan setiap soal dengan baris kosong
`;

        // Convert to base64
        const buffer = Buffer.from(template, 'utf-8');

        return {
            filename: 'template_import_soal.txt',
            buffer: buffer.toString('base64'),
            contentType: 'text/plain',
        };
    }

    /**
     * Convert HTML to plain text while preserving list numbering
     * Word auto-numbered lists are converted to (1), (2), etc. format
     */
    private processHtmlToText(html: string): string {
        if (!html) return '';

        let result = html;

        // Convert ordered lists <ol> to numbered format (1), (2), etc.
        result = result.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
            let num = 1;
            return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (liMatch: string, liContent: string) => {
                const text = this.stripHtmlTags(liContent).trim();
                return `(${num++})${text}\n`;
            });
        });

        // Convert unordered lists <ul> to bullet format
        result = result.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
            return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (liMatch: string, liContent: string) => {
                const text = this.stripHtmlTags(liContent).trim();
                return `• ${text}\n`;
            });
        });

        // Convert paragraphs to lines
        result = result.replace(/<p[^>]*>/gi, '');
        result = result.replace(/<\/p>/gi, '\n');

        // Convert <br> to newlines
        result = result.replace(/<br\s*\/?>/gi, '\n');

        // Strip remaining HTML tags
        result = this.stripHtmlTags(result);

        // Decode HTML entities
        result = result.replace(/&nbsp;/g, ' ');
        result = result.replace(/&amp;/g, '&');
        result = result.replace(/&lt;/g, '<');
        result = result.replace(/&gt;/g, '>');
        result = result.replace(/&quot;/g, '"');
        result = result.replace(/&#39;/g, "'");

        // Clean up multiple newlines
        result = result.replace(/\n{3,}/g, '\n\n');

        return result.trim();
    }

    /**
     * Remove all HTML tags from a string
     */
    private stripHtmlTags(html: string): string {
        return html.replace(/<[^>]*>/g, '');
    }
}
