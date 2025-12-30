import {
    IsString,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsArray,
    IsObject,
    IsBoolean,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRppDto {
    @IsString()
    @IsNotEmpty()
    kode: string;

    // Header Information
    @IsOptional()
    @IsString()
    namaGuru?: string;

    @IsString()
    @IsNotEmpty()
    mataPelajaranId: string;

    @IsString()
    @IsNotEmpty()
    materi: string;

    @IsOptional()
    @IsString()
    fase?: string;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    alokasiWaktu: number;

    @IsOptional()
    @IsString()
    tahunAjaran?: string;

    // I. IDENTIFIKASI
    @IsOptional()
    @IsString()
    identifikasiPesertaDidik?: string;

    @IsOptional()
    @IsString()
    identifikasiMateri?: string;

    @IsOptional()
    @IsArray()
    dimensiProfilLulusan?: string[];

    // II. DESAIN PEMBELAJARAN
    @IsString()
    @IsNotEmpty()
    capaianPembelajaran: string;

    @IsOptional()
    @IsString()
    lintasDisiplinIlmu?: string;

    @IsArray()
    @IsNotEmpty()
    tujuanPembelajaran: string[];

    @IsString()
    @IsNotEmpty()
    topikPembelajaran: string;

    @IsOptional()
    @IsString()
    praktikPedagogik?: string;

    @IsOptional()
    @IsString()
    kemitraanPembelajaran?: string;

    @IsOptional()
    @IsString()
    lingkunganPembelajaran?: string;

    @IsOptional()
    @IsString()
    pemanfaatanDigital?: string;

    // III. PENGALAMAN BELAJAR
    @IsOptional()
    @IsObject()
    kegiatanAwal?: {
        prinsip: string[];
        kegiatan: string;
    };

    @IsOptional()
    @IsObject()
    kegiatanMemahami?: {
        prinsip: string[];
        kegiatan: string;
    };

    @IsOptional()
    @IsObject()
    kegiatanMengaplikasi?: {
        prinsip: string[];
        kegiatan: string;
    };

    @IsOptional()
    @IsObject()
    kegiatanMerefleksi?: {
        prinsip: string[];
        kegiatan: string;
    };

    @IsOptional()
    @IsObject()
    kegiatanPenutup?: {
        prinsip: string[];
        kegiatan: string;
    };

    // IV. ASESMEN PEMBELAJARAN
    @IsOptional()
    @IsString()
    asesmenAwal?: string;

    @IsOptional()
    @IsString()
    asesmenProses?: string;

    @IsOptional()
    @IsString()
    asesmenAkhir?: string;

    // Additional fields
    @IsOptional()
    @IsArray()
    kelasIds?: string[];

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;
}

export class UpdateRppDto {
    @IsOptional()
    @IsString()
    kode?: string;

    @IsOptional()
    @IsString()
    namaGuru?: string;

    @IsOptional()
    @IsString()
    mataPelajaranId?: string;

    @IsOptional()
    @IsString()
    materi?: string;

    @IsOptional()
    @IsString()
    fase?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    alokasiWaktu?: number;

    @IsOptional()
    @IsString()
    tahunAjaran?: string;

    @IsOptional()
    @IsString()
    identifikasiPesertaDidik?: string;

    @IsOptional()
    @IsString()
    identifikasiMateri?: string;

    @IsOptional()
    @IsArray()
    dimensiProfilLulusan?: string[];

    @IsOptional()
    @IsString()
    capaianPembelajaran?: string;

    @IsOptional()
    @IsString()
    lintasDisiplinIlmu?: string;

    @IsOptional()
    @IsArray()
    tujuanPembelajaran?: string[];

    @IsOptional()
    @IsString()
    topikPembelajaran?: string;

    @IsOptional()
    @IsString()
    praktikPedagogik?: string;

    @IsOptional()
    @IsString()
    kemitraanPembelajaran?: string;

    @IsOptional()
    @IsString()
    lingkunganPembelajaran?: string;

    @IsOptional()
    @IsString()
    pemanfaatanDigital?: string;

    @IsOptional()
    @IsObject()
    kegiatanAwal?: {
        prinsip: string[];
        kegiatan: string;
    };

    @IsOptional()
    @IsObject()
    kegiatanMemahami?: {
        prinsip: string[];
        kegiatan: string;
    };

    @IsOptional()
    @IsObject()
    kegiatanMengaplikasi?: {
        prinsip: string[];
        kegiatan: string;
    };

    @IsOptional()
    @IsObject()
    kegiatanMerefleksi?: {
        prinsip: string[];
        kegiatan: string;
    };

    @IsOptional()
    @IsObject()
    kegiatanPenutup?: {
        prinsip: string[];
        kegiatan: string;
    };

    @IsOptional()
    @IsString()
    asesmenAwal?: string;

    @IsOptional()
    @IsString()
    asesmenProses?: string;

    @IsOptional()
    @IsString()
    asesmenAkhir?: string;

    @IsOptional()
    @IsArray()
    kelasIds?: string[];

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @IsOptional()
    @IsString()
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class QueryRppDto {
    @IsOptional()
    @IsString()
    mataPelajaranId?: string;

    @IsOptional()
    @IsString()
    kelasId?: string;

    @IsOptional()
    @IsString()
    guruId?: string;

    @IsOptional()
    @IsString()
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit?: number;
}
