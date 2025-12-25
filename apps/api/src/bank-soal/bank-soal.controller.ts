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
    Req,
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
    findAll(@Query() filterDto: FilterBankSoalDto, @Req() req: any) {
        // If user is GURU, filter only bank soal from their mata pelajaran
        if (req.user.role === Role.GURU && req.user.mataPelajaranIds && req.user.mataPelajaranIds.length > 0) {
            filterDto.mataPelajaranIds = req.user.mataPelajaranIds;
        }
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

            // Split by [NOMOR pattern to get individual questions
            // Support [NOMOR 1], [NOMOR-1], or [NOMOR: 1]
            const questionBlocks = text
                .split(/\[NOMOR(?:\s*[-:]\s*|\s+)\d+\]/i)
                .filter(Boolean);

            const htmlBlocks = html
                .split(/\[NOMOR(?:\s*[-:]\s*|\s+)\d+\]/i)
                .filter(Boolean);

            console.log('\n=== STARTING QUESTION PARSING ===');
            console.log('Total question blocks found:', questionBlocks.length);

            questionBlocks.forEach((block, index) => {
                const questionNumber = index + 1;
                const htmlBlock = htmlBlocks[index] || '';

                console.log(`\n--- Parsing Question #${questionNumber} ---`);
                console.log('Text block preview:', block.substring(0, 200));

                // Extract JENIS SOAL - handle merged text like "ESSAYNILAI" or "PGNILAI"
                const jenisMatch = block.match(
                    /(?:JENIS\s*:?\s*SOAL\s*:?\s*)?(ESSAY|PG|PILIHAN\s*GANDA)(?:\s*NILAI|\s*:|\s+)/i
                );
                const jenisSoal = jenisMatch ? jenisMatch[1].toUpperCase() : null;

                console.log('JENIS SOAL detected:', jenisSoal);

                if (!jenisSoal) {
                    console.log('⚠️ Skipping - No JENIS SOAL found');
                    return; // Skip invalid questions
                }

                const tipe = jenisSoal === 'ESSAY' ? 'ESSAY' : 'PILIHAN_GANDA';

                // Extract NILAI - handle merged text like "ESSAYNILAI:12" or "NILAI:12"
                const nilaiMatch = block.match(/(?:NILAI|ESSAY|PG)\s*:?\s*(\d+)/i);
                const bobot = nilaiMatch ? parseInt(nilaiMatch[1]) : 1;

                console.log('NILAI/bobot:', bobot);

                // Extract SOAL - handle merged text
                let pertanyaan = '';

                // First try to find "SOAL:" explicitly
                const soalExplicitMatch = block.match(
                    /(?:^|\r?\n)\s*SOAL\s*:?\s*([^]*)(?=(?:^|\r?\n)\s*(?:JAWABAN\s*:?|KUNCI\s*[:\s]+JAWABAN\s*:?)|$)/i
                );

                if (soalExplicitMatch) {
                    pertanyaan = soalExplicitMatch[1].trim();
                } else {
                    // Fallback: Extract text after the point value until JAWABAN
                    const afterNilaiMatch = block.match(
                        /(?:^|\r?\n)\s*\d+\s*([^]*)(?=(?:^|\r?\n)\s*(?:JAWABAN\s*:?|KUNCI\s*[:\s]+JAWABAN\s*:?)|$)/i
                    );
                    if (afterNilaiMatch) {
                        pertanyaan = afterNilaiMatch[1]
                            .replace(/^SOAL\s*:?\s*/i, '')
                            .trim();
                    }
                }

                console.log('PERTANYAAN extracted:', pertanyaan.substring(0, 100));

                if (!pertanyaan) {
                    console.log('⚠️ Skipping - No question text found');
                    return; // Skip if no question text
                }

                const soal: any = {
                    tipe,
                    bobot,
                    pertanyaan: this.decodeHtmlEntities(pertanyaan),
                };

                if (tipe === 'PILIHAN_GANDA') {
                    const pilihanJawaban: any[] = [];

                    // Extract KUNCI JAWABAN first
                    const kunciMatch = block.match(
                        /KUNCI\s*[:\s]+JAWABAN\s*:?\s*([A-Ea-e1-5])/i
                    );
                    let kunciValue = kunciMatch ? kunciMatch[1].toUpperCase() : '';

                    // Convert number to letter if needed
                    const numberToLetter: { [key: string]: string } = {
                        '1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E',
                    };
                    if (numberToLetter[kunciValue]) {
                        kunciValue = numberToLetter[kunciValue];
                    }

                    console.log('KUNCI JAWABAN:', kunciValue);

                    // Extract JAWABAN section
                    const jawabanMatch = block.match(
                        /(?:^|\r?\n)\s*JAWABAN\s*:?\s*([^]*)(?=(?:^|\r?\n)\s*KUNCI\s*[:\s]+JAWABAN\s*:?|$)/i
                    );

                    if (jawabanMatch) {
                        const jawabanText = jawabanMatch[1].trim();
                        console.log('JAWABAN section found, length:', jawabanText.length);
                        console.log('JAWABAN preview:', jawabanText.substring(0, 200));

                        // First try: HTML lists (Word numbering)
                        const jawabanHtmlMatch = htmlBlock.match(
                            /JAWABAN\s*:?\s*([^]*?)(?=KUNCI\s+JAWABAN|$)/i
                        );

                        let extractedFromHtml = false;

                        if (jawabanHtmlMatch) {
                            const jawabanHtml = jawabanHtmlMatch[1];
                            const listItems = jawabanHtml.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);

                            console.log('HTML list items found:', listItems ? listItems.length : 0);

                            if (listItems && listItems.length >= 4) {
                                const options = ['A', 'B', 'C', 'D', 'E'];
                                listItems.slice(0, 5).forEach((item, idx) => {
                                    let text = this.stripHtmlTags(item)
                                        .replace(/^\d+\.?\s*/, '') // Remove leading number
                                        .replace(/^[a-e]\.?\s*/i, '') // Remove leading letter
                                        .trim();
                                    text = this.decodeHtmlEntities(text);

                                    console.log(`  Option ${options[idx]}:`, text.substring(0, 50));

                                    if (text) {
                                        pilihanJawaban.push({
                                            id: options[idx],
                                            text,
                                            isCorrect: options[idx] === kunciValue,
                                        });
                                    }
                                });

                                extractedFromHtml = true;
                                console.log('✓ Extracted from HTML lists');
                            }
                        }

                        // Second try: Plain text with each line as an option (TEMPLATE FORMAT)
                        if (!extractedFromHtml) {
                            // Split by newlines and filter out empty lines
                            const lines = jawabanText
                                .split(/\r?\n/)
                                .map(line => line.trim())
                                .filter(line => line.length > 0 && !line.match(/^KUNCI/i));

                            console.log('Plain text lines found:', lines.length);
                            console.log('Lines:', lines);

                            if (lines.length >= 4) {
                                const options = ['A', 'B', 'C', 'D', 'E'];
                                lines.slice(0, 5).forEach((line, idx) => {
                                    // Remove any leading letters or numbers
                                    let text = line
                                        .replace(/^[A-Ea-e1-5][\.\)]\s*/, '')
                                        .replace(/^\d+[\.\)]\s*/, '')
                                        .trim();
                                    text = this.decodeHtmlEntities(text);

                                    console.log(`  Option ${options[idx]}:`, text.substring(0, 50));

                                    if (text) {
                                        pilihanJawaban.push({
                                            id: options[idx],
                                            text,
                                            isCorrect: options[idx] === kunciValue,
                                        });
                                    }
                                });
                                console.log('✓ Extracted from plain text lines');
                            } else {
                                console.log('⚠️ Not enough lines for options');
                            }
                        }
                    } else {
                        console.log('⚠️ No JAWABAN section found');
                    }

                    console.log('Total options extracted:', pilihanJawaban.length);
                    soal.pilihanJawaban = pilihanJawaban;
                } else if (tipe === 'ESSAY') {
                    // For essay, try to extract from JAWABAN or KUNCI JAWABAN section
                    let textAnswer = '';

                    // Pattern 1: Extract from JAWABAN section
                    let jawabanMatch = block.match(
                        /JAWABAN\s*:?\s*([^]*)(?=KUNCI\s+JAWABAN\s*:?|$)/i
                    );

                    // Pattern 2: If JAWABAN is empty, try KUNCI JAWABAN
                    if (!jawabanMatch || !jawabanMatch[1].trim()) {
                        jawabanMatch = block.match(
                            /KUNCI\s+JAWABAN\s*:?\s*([^]*)$/i
                        );
                    }

                    if (jawabanMatch) {
                        textAnswer = jawabanMatch[1]
                            .trim()
                            .replace(/^[-\s]+|[-\s]+$/g, '')
                            .trim();
                    }

                    console.log('ESSAY answer:', textAnswer.substring(0, 100));

                    if (textAnswer && textAnswer !== '-') {
                        soal.penjelasan = this.decodeHtmlEntities(textAnswer);
                    }
                }

                // Only add if we have a valid question
                if (soal.pertanyaan) {
                    console.log('✓ Question added to list');
                    soalList.push(soal);
                } else {
                    console.log('⚠️ Question skipped - missing pertanyaan');
                }
            });

            console.log('\n=== PARSING COMPLETE ===');
            console.log('Total questions extracted:', soalList.length);
            console.log('Questions:', JSON.stringify(soalList, null, 2));

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
     * Decode all HTML entities to preserve special characters
     */
    private decodeHtmlEntities(text: string): string {
        if (!text) return '';

        let result = text;

        // Common HTML entities
        const entities: Record<string, string> = {
            '&nbsp;': ' ',
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&apos;': "'",
            '&cent;': '¢',
            '&pound;': '£',
            '&yen;': '¥',
            '&euro;': '€',
            '&copy;': '©',
            '&reg;': '®',
        };

        // Replace named entities
        for (const [entity, char] of Object.entries(entities)) {
            result = result.replace(new RegExp(entity, 'g'), char);
        }

        // Decode numeric entities (decimal)
        result = result.replace(/&#(\d+);/g, (match, dec) => {
            return String.fromCharCode(parseInt(dec));
        });

        // Decode numeric entities (hexadecimal)
        result = result.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
            return String.fromCharCode(parseInt(hex, 16));
        });

        return result;
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

        // Clean up multiple newlines
        result = result.replace(/\n{3,}/g, '\n\n');

        return result.trim();
    }

    /**
     * Remove all HTML tags from a string and decode entities
     */
    private stripHtmlTags(html: string): string {
        const stripped = html.replace(/<[^>]*>/g, '');
        return this.decodeHtmlEntities(stripped);
    }
}
