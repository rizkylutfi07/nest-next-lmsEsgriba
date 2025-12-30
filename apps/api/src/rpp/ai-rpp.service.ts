import { Injectable, Logger } from '@nestjs/common';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { ConfigService } from '@nestjs/config';

export interface GenerateRppInput {
    mataPelajaran: string;
    materi: string;
    fase: string;
    alokasiWaktu: number;
    dimensiProfilLulusan: string[];
}

export interface GeneratedRppContent {
    // I. IDENTIFIKASI
    identifikasiPesertaDidik: string;
    identifikasiMateri: string;

    // II. DESAIN PEMBELAJARAN
    capaianPembelajaran: string;
    lintasDisiplinIlmu?: string;
    tujuanPembelajaran: string[];
    topikPembelajaran: string;
    praktikPedagogik?: string;
    kemitraanPembelajaran?: string;
    lingkunganPembelajaran?: string;
    pemanfaatanDigital?: string;

    // III. PENGALAMAN BELAJAR
    kegiatanAwal?: {
        prinsip: string[];
        kegiatan: string;
    };
    kegiatanMemahami?: {
        prinsip: string[];
        kegiatan: string;
    };
    kegiatanMengaplikasi?: {
        prinsip: string[];
        kegiatan: string;
    };
    kegiatanMerefleksi?: {
        prinsip: string[];
        kegiatan: string;
    };
    kegiatanPenutup?: {
        prinsip: string[];
        kegiatan: string;
    };

    // IV. ASESMEN
    asesmenAwal?: string;
    asesmenProses?: string;
    asesmenAkhir?: string;
}

@Injectable()
export class AiRppService {
    private readonly logger = new Logger(AiRppService.name);
    private readonly apiKey: string;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GOOGLE_GENERATIVE_AI_API_KEY');
        this.apiKey = apiKey || '';
        if (!this.apiKey) {
            this.logger.warn('GOOGLE_GENERATIVE_AI_API_KEY not configured. AI RPP generation will not work.');
        }
    }

    async generateRpp(input: GenerateRppInput): Promise<GeneratedRppContent> {
        if (!this.apiKey) {
            throw new Error('Google Gemini API key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY in environment variables.');
        }

        this.logger.log(`Generating RPP for: ${input.mataPelajaran} - ${input.materi}`);

        const dimensiLabels = {
            BERIMAN_BERTAKWA: 'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
            BERKEBINEKAAN_GLOBAL: 'Berkebinekaan Global',
            BERGOTONG_ROYONG: 'Bergotong Royong',
            MANDIRI: 'Mandiri',
            BERNALAR_KRITIS: 'Bernalar Kritis',
            KREATIF: 'Kreatif',
            KOMUNIKATIF: 'Komunikatif',
            INOVATIF: 'Inovatif',
        };

        const dimensiText = input.dimensiProfilLulusan
            .map(d => dimensiLabels[d] || d)
            .join(', ');

        const prompt = `Anda adalah guru berpengalaman di Indonesia yang ahli dalam menyusun Rencana Pelaksanaan Pembelajaran (RPP) sesuai format resmi Kurikulum Merdeka dengan pendekatan Deep Learning.

Buatkan RPP dengan data berikut:
- Mata Pelajaran: ${input.mataPelajaran}
- Materi/Topik: ${input.materi}
- Fase/Kelas: ${input.fase}
- Alokasi Waktu: ${input.alokasiWaktu} menit
- Dimensi Profil Pelajar Pancasila: ${dimensiText}

INSTRUKSI PENTING:
1. Gunakan bahasa Indonesia yang baik, benar, dan formal
2. Sesuaikan dengan Capaian Pembelajaran Kurikulum Merdeka untuk fase tersebut
3. Gunakan prinsip pembelajaran: Mindful (berkesadaran), Meaningful (bermakna), Joyful (menyenangkan)
4. Kegiatan harus konkret, aplikatif, dan student-centered
5. Asesmen harus autentik dan holistik
6. JANGAN gunakan format markdown seperti **, *, #, atau simbol lainnya. Tulis teks polos saja.

Format output dalam JSON dengan struktur:
{
  "identifikasiPesertaDidik": "Deskripsi karakteristik peserta didik, kesiapan belajar, pengetahuan awal, minat, dan kebutuhan khusus",
  "identifikasiMateri": "Analisis jenis pengetahuan (konseptual/prosedural/faktual), relevansi dengan kehidupan, dan tingkat kesulitan",
  "capaianPembelajaran": "Capaian pembelajaran sesuai kurikulum merdeka untuk fase ini",
  "lintasDisiplinIlmu": "Disiplin ilmu lain yang relevan (opsional)",
  "tujuanPembelajaran": ["Tujuan 1 yang SMART", "Tujuan 2", "Tujuan 3"],
  "topikPembelajaran": "Topik pembelajaran secara spesifik",
  "praktikPedagogik": "Model, strategi, dan metode pembelajaran yang digunakan",
  "kemitraanPembelajaran": "Kemitraan dengan pihak luar jika ada (opsional)",
  "lingkunganPembelajaran": "Setting ruang fisik, virtual, dan budaya belajar",
  "pemanfaatanDigital": "Teknologi digital yang dimanfaatkan",
  "kegiatanAwal": {
    "prinsip": ["Mindful", "Meaningful"],
    "kegiatan": "Langkah-langkah kegiatan awal yang jelas dan terstruktur"
  },
  "kegiatanMemahami": {
    "prinsip": ["Meaningful", "Mindful"],
    "kegiatan": "Kegiatan untuk memahami konsep/materi"
  },
  "kegiatanMengaplikasi": {
    "prinsip": ["Meaningful", "Joyful"],
    "kegiatan": "Kegiatan untuk mengaplikasikan pengetahuan"
  },
  "kegiatanMerefleksi": {
    "prinsip": ["Mindful"],
    "kegiatan": "Kegiatan refleksi pembelajaran"
  },
  "kegiatanPenutup": {
    "prinsip": ["Mindful"],
    "kegiatan": "Kegiatan penutup pembelajaran"
  },
  "asesmenAwal": "Asesmen untuk mengecek pengetahuan awal",
  "asesmenProses": "Asesmen selama proses pembelajaran",
  "asesmenAkhir": "Asesmen di akhir pembelajaran"
}

PASTIKAN output adalah valid JSON yang dapat di-parse.`;

        try {
            // Create a Google AI instance with the API key
            const google = createGoogleGenerativeAI({
                apiKey: this.apiKey,
            });

            const { text } = await generateText({
                model: google('gemini-2.5-flash'),
                prompt,
                temperature: 0.7,
            });

            this.logger.log('AI generation completed');

            // Parse JSON response - extract the first valid JSON object
            let jsonString = '';
            let braceCount = 0;
            let inString = false;
            let escapeNext = false;
            let started = false;

            for (const char of text) {
                if (escapeNext) {
                    if (started) jsonString += char;
                    escapeNext = false;
                    continue;
                }

                if (char === '\\' && inString) {
                    if (started) jsonString += char;
                    escapeNext = true;
                    continue;
                }

                if (char === '"' && !escapeNext) {
                    inString = !inString;
                }

                if (!inString) {
                    if (char === '{') {
                        if (!started) started = true;
                        braceCount++;
                    } else if (char === '}') {
                        braceCount--;
                    }
                }

                if (started) {
                    jsonString += char;
                    if (braceCount === 0) break;
                }
            }

            if (!jsonString) {
                throw new Error('Failed to extract JSON from AI response');
            }

            const generated: GeneratedRppContent = JSON.parse(jsonString);

            // Validate required fields
            if (!generated.capaianPembelajaran || !generated.tujuanPembelajaran) {
                throw new Error('AI generated incomplete RPP content');
            }

            return generated;
        } catch (error) {
            this.logger.error('Failed to generate RPP with AI', error);
            throw new Error(`AI generation failed: ${error.message}`);
        }
    }
}
