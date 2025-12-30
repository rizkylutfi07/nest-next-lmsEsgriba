export enum DimensiProfilLulusan {
    KEIMANAN_KETAQWAAN = 'KEIMANAN_KETAQWAAN',
    KEWARGAAN = 'KEWARGAAN',
    PENALARAN_KRITIS = 'PENALARAN_KRITIS',
    KREATIFITAS = 'KREATIFITAS',
    KOLABORASI = 'KOLABORASI',
    KEMANDIRIAN = 'KEMANDIRIAN',
    KESEHATAN = 'KESEHATAN',
    KOMUNIKASI = 'KOMUNIKASI',
}

export const DimensiProfilLulusanLabels: Record<DimensiProfilLulusan, string> = {
    [DimensiProfilLulusan.KEIMANAN_KETAQWAAN]: 'DPL 1: Keimanan dan Ketaqwaan terhadap Tuhan YME',
    [DimensiProfilLulusan.KEWARGAAN]: 'DPL 2: Kewargaan',
    [DimensiProfilLulusan.PENALARAN_KRITIS]: 'DPL 3: Penalaran Kritis',
    [DimensiProfilLulusan.KREATIFITAS]: 'DPL 4: Kreatifitas',
    [DimensiProfilLulusan.KOLABORASI]: 'DPL 5: Kolaborasi',
    [DimensiProfilLulusan.KEMANDIRIAN]: 'DPL 6: Kemandirian',
    [DimensiProfilLulusan.KESEHATAN]: 'DPL 7: Kesehatan',
    [DimensiProfilLulusan.KOMUNIKASI]: 'DPL 8: Komunikasi',
};

export enum StatusRPP {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

export const StatusRPPLabels: Record<StatusRPP, string> = {
    [StatusRPP.DRAFT]: 'Draft',
    [StatusRPP.PUBLISHED]: 'Dipublikasikan',
    [StatusRPP.ARCHIVED]: 'Diarsipkan',
};

export interface KegiatanPembelajaran {
    prinsip: string[]; // e.g., ['berkesadaran', 'bermakna', 'menggembirakan']
    kegiatan: string; // Deskripsi kegiatan
}

export interface RPP {
    id: string;
    kode: string;

    // Header
    namaGuru?: string;
    mataPelajaranId: string;
    mataPelajaran?: {
        id: string;
        nama: string;
        kode: string;
    };
    materi: string;
    fase?: string;
    alokasiWaktu: number;
    tahunAjaran?: string;

    guruId: string;
    guru?: {
        id: string;
        nama: string;
        nip: string;
        email?: string;
    };

    // I. IDENTIFIKASI
    identifikasiPesertaDidik?: string;
    identifikasiMateri?: string;
    dimensiProfilLulusan?: string[];

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
    kegiatanAwal?: KegiatanPembelajaran;
    kegiatanMemahami?: KegiatanPembelajaran;
    kegiatanMengaplikasi?: KegiatanPembelajaran;
    kegiatanMerefleksi?: KegiatanPembelajaran;
    kegiatanPenutup?: KegiatanPembelajaran;

    // IV. ASESMEN PEMBELAJARAN
    asesmenAwal?: string;
    asesmenProses?: string;
    asesmenAkhir?: string;

    // Metadata
    status: StatusRPP;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;

    rppKelas?: Array<{
        id: string;
        kelasId: string;
        kelas: {
            id: string;
            nama: string;
            tingkat: string;
            jurusan?: {
                id: string;
                nama: string;
                kode: string;
            };
        };
    }>;
}

export interface CreateRPPDto {
    kode: string;
    namaGuru?: string;
    mataPelajaranId: string;
    materi: string;
    fase?: string;
    alokasiWaktu: number;
    tahunAjaran?: string;

    identifikasiPesertaDidik?: string;
    identifikasiMateri?: string;
    dimensiProfilLulusan?: string[];

    capaianPembelajaran: string;
    lintasDisiplinIlmu?: string;
    tujuanPembelajaran: string[];
    topikPembelajaran: string;
    praktikPedagogik?: string;
    kemitraanPembelajaran?: string;
    lingkunganPembelajaran?: string;
    pemanfaatanDigital?: string;

    kegiatanAwal?: KegiatanPembelajaran;
    kegiatanMemahami?: KegiatanPembelajaran;
    kegiatanMengaplikasi?: KegiatanPembelajaran;
    kegiatanMerefleksi?: KegiatanPembelajaran;
    kegiatanPenutup?: KegiatanPembelajaran;

    asesmenAwal?: string;
    asesmenProses?: string;
    asesmenAkhir?: string;

    kelasIds?: string[];
    isPublished?: boolean;
}

export interface UpdateRPPDto extends Partial<CreateRPPDto> {
    status?: StatusRPP;
}

export interface QueryRPPDto {
    mataPelajaranId?: string;
    kelasId?: string;
    guruId?: string;
    status?: StatusRPP;
    search?: string;
    page?: number;
    limit?: number;
}

export interface RPPListResponse {
    data: RPP[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface RPPStats {
    total: number;
    draft: number;
    published: number;
    archived: number;
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
    kegiatanAwal?: KegiatanPembelajaran;
    kegiatanMemahami?: KegiatanPembelajaran;
    kegiatanMengaplikasi?: KegiatanPembelajaran;
    kegiatanMerefleksi?: KegiatanPembelajaran;
    kegiatanPenutup?: KegiatanPembelajaran;

    // IV. ASESMEN
    asesmenAwal?: string;
    asesmenProses?: string;
    asesmenAkhir?: string;
}
