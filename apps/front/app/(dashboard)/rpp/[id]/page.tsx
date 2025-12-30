'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { rppApi, settingsApi } from '@/lib/api';
import { RPP, DimensiProfilLulusanLabels } from '@/types/rpp';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ChevronLeft, Printer, Edit } from 'lucide-react';
import { cleanMarkdown, PAPER_SIZES, PaperSize } from '@/hooks/use-rpp-pdf';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function RppDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [rpp, setRpp] = useState<RPP | null>(null);
    const [loading, setLoading] = useState(true);
    const [paperSize, setPaperSize] = useState<PaperSize>('A4');
    const [schoolSettings, setSchoolSettings] = useState({
        name: '',
        principalName: '',
        principalNip: '',
        location: '',
    });

    useEffect(() => {
        fetchRpp();
        fetchSchoolSettings();
    }, [id]);

    const fetchSchoolSettings = async () => {
        try {
            const settings = await settingsApi.getSchoolSettings();
            // Extract location from address (e.g., "Jl. Raya Bandongan" -> "Bandongan")
            const address = settings.school_address || '';
            const location = address.split(',').pop()?.trim() || address.split(' ').pop() || 'Bandongan';
            setSchoolSettings({
                name: settings.school_name || 'SMA NEGERI 1 BANDONGAN',
                principalName: settings.school_principal_name || '',
                principalNip: settings.school_principal_nip || '',
                location: location,
            });
        } catch {
            setSchoolSettings({
                name: 'SMA NEGERI 1 BANDONGAN',
                principalName: '',
                principalNip: '',
                location: 'Bandongan',
            });
        }
    };

    const fetchRpp = async () => {
        try {
            setLoading(true);
            const data = await rppApi.getOne(id);
            setRpp(data as RPP);
        } catch (error: any) {
            toast.error(error.message || 'Gagal memuat RPP');
            router.push('/rpp');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!rpp) return null;

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            {/* Action buttons - Hidden when printing */}
            <div className="flex items-center justify-between mb-6 print:hidden">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Kembali
                </Button>
                <div className="flex gap-2 items-center">
                    <Select value={paperSize} onValueChange={(v) => setPaperSize(v as PaperSize)}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Ukuran Kertas" />
                        </SelectTrigger>
                        <SelectContent>
                            {(Object.entries(PAPER_SIZES) as [PaperSize, { width: number; height: number; label: string }][]).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => router.push(`/rpp/${rpp.id}/edit`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                </div>
            </div>

            {/* RPP Content - Print-friendly */}
            <Card className="print:shadow-none print:border-0">
                <CardContent className="p-8 print:p-12">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-xl font-bold mb-1">{schoolSettings.name.toUpperCase()}</h1>
                        <h2 className="text-lg font-bold mb-1">RENCANA PELAKSANAAN PEMBELAJARAN (RPP)</h2>
                        <h3 className="text-base font-bold mb-4">PENDEKATAN DEEP LEARNING</h3>
                    </div>

                    {/* Header Information Table */}
                    <div className="mb-8 text-sm">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                            <div className="flex">
                                <span className="w-32 shrink-0">Nama Guru</span>
                                <span className="shrink-0">: </span>
                                <span className="whitespace-nowrap">{rpp.guru?.nama || rpp.namaGuru || '...'}</span>
                            </div>
                            <div></div>

                            <div className="flex">
                                <span className="w-32 shrink-0">Mata Pelajaran</span>
                                <span className="shrink-0">: </span>
                                <span>{rpp.mataPelajaran?.nama || '...'}</span>
                            </div>
                            <div className="flex">
                                <span className="w-24 shrink-0">Materi</span>
                                <span className="shrink-0">: </span>
                                <span>{rpp.materi}</span>
                            </div>

                            <div className="flex">
                                <span className="w-32 shrink-0">Fase/Kelas/Smt</span>
                                <span className="shrink-0">: </span>
                                <span>{rpp.fase || '...'}</span>
                            </div>
                            <div className="flex">
                                <span className="w-24 shrink-0">Alokasi Waktu</span>
                                <span className="shrink-0">: </span>
                                <span>{rpp.alokasiWaktu} menit</span>
                            </div>
                        </div>
                        <p className="text-center mt-4 font-semibold">
                            TAHUN AJARAN {rpp.tahunAjaran || '2025/2026'}
                        </p>
                    </div>

                    {/* I. IDENTIFIKASI */}
                    <section className="mb-6">
                        <h3 className="font-bold text-base mb-3">I. IDENTIFIKASI</h3>

                        <div className="mb-3">
                            <h4 className="font-semibold text-sm mb-1">A. Peserta Didik:</h4>
                            <p className="text-sm text-justify whitespace-pre-wrap">
                                {cleanMarkdown(rpp.identifikasiPesertaDidik) || 'Belum diisi'}
                            </p>
                        </div>

                        <div className="mb-3">
                            <h4 className="font-semibold text-sm mb-1">B. Materi Pembelajaran:</h4>
                            <p className="text-sm text-justify whitespace-pre-wrap">
                                {cleanMarkdown(rpp.identifikasiMateri) || 'Belum diisi'}
                            </p>
                        </div>

                        <div className="mb-3">
                            <h4 className="font-semibold text-sm mb-1">C. Dimensi Profil Lulusan:</h4>
                            {rpp.dimensiProfilLulusan && (rpp.dimensiProfilLulusan as string[]).length > 0 ? (
                                <ul className="text-sm list-disc list-inside">
                                    {(rpp.dimensiProfilLulusan as string[]).map((dimensi, idx) => (
                                        <li key={idx}>{DimensiProfilLulusanLabels[dimensi as keyof typeof DimensiProfilLulusanLabels]}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm">Belum dipilih</p>
                            )}
                        </div>
                    </section>

                    {/* II. DESAIN PEMBELAJARAN */}
                    <section className="mb-6">
                        <h3 className="font-bold text-base mb-3">II. DESAIN PEMBELAJARAN</h3>

                        <div className="mb-3">
                            <h4 className="font-semibold text-sm mb-1">A. Capaian Pembelajaran:</h4>
                            <p className="text-sm text-justify whitespace-pre-wrap">{cleanMarkdown(rpp.capaianPembelajaran)}</p>
                        </div>

                        {rpp.lintasDisiplinIlmu && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">B. Lintas Disiplin Ilmu:</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{cleanMarkdown(rpp.lintasDisiplinIlmu)}</p>
                            </div>
                        )}

                        <div className="mb-3">
                            <h4 className="font-semibold text-sm mb-1">C. Tujuan Pembelajaran:</h4>
                            <ul className="text-sm list-decimal list-inside">
                                {(rpp.tujuanPembelajaran as string[]).map((tujuan, idx) => (
                                    <li key={idx} className="mb-1">{cleanMarkdown(tujuan)}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-3">
                            <h4 className="font-semibold text-sm mb-1">D. Topik Pembelajaran:</h4>
                            <p className="text-sm text-justify whitespace-pre-wrap">{cleanMarkdown(rpp.topikPembelajaran)}</p>
                        </div>

                        {rpp.praktikPedagogik && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">E. Praktik Pedagogik:</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{cleanMarkdown(rpp.praktikPedagogik)}</p>
                            </div>
                        )}

                        {rpp.kemitraanPembelajaran && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">F. Kemitraan Pembelajaran:</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{cleanMarkdown(rpp.kemitraanPembelajaran)}</p>
                            </div>
                        )}

                        {rpp.lingkunganPembelajaran && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">G. Lingkungan Pembelajaran:</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{cleanMarkdown(rpp.lingkunganPembelajaran)}</p>
                            </div>
                        )}

                        {rpp.pemanfaatanDigital && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">H. Pemanfaatan Digital:</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{cleanMarkdown(rpp.pemanfaatanDigital)}</p>
                            </div>
                        )}
                    </section>

                    {/* III. PENGALAMAN BELAJAR */}
                    <section className="mb-6">
                        <h3 className="font-bold text-base mb-3">III. PENGALAMAN BELAJAR</h3>
                        <p className="text-sm italic mb-3">
                            Langkah-langkah pembelajaran: Kegiatan pembelajaran berbasis <strong>mindful</strong> (berkesadaran), <strong>meaningful</strong> (bermakna), dan <strong>joyful</strong> (menyenangkan)
                        </p>

                        {rpp.kegiatanAwal && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-sm mb-1">
                                    A. Awal ({(rpp.kegiatanAwal as any).prinsip?.join(', ') || ''})
                                </h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">
                                    {cleanMarkdown((rpp.kegiatanAwal as any).kegiatan)}
                                </p>
                            </div>
                        )}

                        <div className="mb-3">
                            <h4 className="font-semibold text-sm mb-2">B. Inti</h4>

                            {rpp.kegiatanMemahami && (
                                <div className="mb-3 ml-4">
                                    <h5 className="font-semibold text-sm mb-1">
                                        1. Memahami ({(rpp.kegiatanMemahami as any).prinsip?.join(', ') || ''})
                                    </h5>
                                    <p className="text-sm text-justify whitespace-pre-wrap">
                                        {cleanMarkdown((rpp.kegiatanMemahami as any).kegiatan)}
                                    </p>
                                </div>
                            )}

                            {rpp.kegiatanMengaplikasi && (
                                <div className="mb-3 ml-4">
                                    <h5 className="font-semibold text-sm mb-1">
                                        2. Mengaplikasi ({(rpp.kegiatanMengaplikasi as any).prinsip?.join(', ') || ''})
                                    </h5>
                                    <p className="text-sm text-justify whitespace-pre-wrap">
                                        {cleanMarkdown((rpp.kegiatanMengaplikasi as any).kegiatan)}
                                    </p>
                                </div>
                            )}

                            {rpp.kegiatanMerefleksi && (
                                <div className="mb-3 ml-4">
                                    <h5 className="font-semibold text-sm mb-1">
                                        3. Merefleksi ({(rpp.kegiatanMerefleksi as any).prinsip?.join(', ') || ''})
                                    </h5>
                                    <p className="text-sm text-justify whitespace-pre-wrap">
                                        {cleanMarkdown((rpp.kegiatanMerefleksi as any).kegiatan)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {rpp.kegiatanPenutup && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-sm mb-1">
                                    C. Penutup ({(rpp.kegiatanPenutup as any).prinsip?.join(', ') || ''})
                                </h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">
                                    {cleanMarkdown((rpp.kegiatanPenutup as any).kegiatan)}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* IV. ASESMEN PEMBELAJARAN */}
                    <section className="mb-8">
                        <h3 className="font-bold text-base mb-3">IV. ASESMEN PEMBELAJARAN</h3>

                        {rpp.asesmenAwal && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">A. Asesmen pada Awal Pembelajaran</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{cleanMarkdown(rpp.asesmenAwal)}</p>
                            </div>
                        )}

                        {rpp.asesmenProses && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">B. Asesmen pada Proses Pembelajaran</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{cleanMarkdown(rpp.asesmenProses)}</p>
                            </div>
                        )}

                        {rpp.asesmenAkhir && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">C. Asesmen pada Akhir Pembelajaran</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{cleanMarkdown(rpp.asesmenAkhir)}</p>
                            </div>
                        )}
                    </section>

                    {/* Signature Section */}
                    <div className="mt-16">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="text-center">
                                <p className="text-sm">Mengetahui,</p>
                                <p className="text-sm font-semibold mb-16">Kepala Sekolah</p>
                                <p className="text-sm font-semibold">{schoolSettings.principalName || '_______________________'}</p>
                                <p className="text-sm">NIP. {schoolSettings.principalNip}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm">{schoolSettings.location}, _______________</p>
                                <p className="text-sm font-semibold mb-16">Guru,</p>
                                <p className="text-sm font-semibold">{rpp.guru?.nama || '___________________'}</p>
                                <p className="text-sm">NIP. {rpp.guru?.nip || ''}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Print styles */}
            <style jsx global>{`
                @media print {
                    /* Hide navigation elements and images */
                    aside,
                    header,
                    nav,
                    img,
                    svg,
                    [class*="MobileBottomNav"],
                    [class*="bottom-nav"],
                    .print\\:hidden {
                        display: none !important;
                    }
                    
                    /* Reset body and html for print */
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    
                    /* Make main content full width */
                    main,
                    main > div,
                    [class*="flex-1"],
                    [class*="container"] {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        max-width: none !important;
                        padding-left: 0 !important;
                    }
                    
                    /* Clean up card styles and remove all shadows */
                    * {
                        box-shadow: none !important;
                        text-shadow: none !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:border-0 {
                        border: 0 !important;
                    }
                    
                    /* Page settings with proper margins */
                    @page {
                        size: ${paperSize === 'F4' ? '215.9mm 330.2mm' : 'A4'};
                        margin: 1.2cm 1cm;
                    }
                    
                    /* Content padding for better readability */
                    [data-print-content] {
                        padding: 0 !important;
                    }
                    
                    /* Better typography for print */
                    p, li, td {
                        font-size: 11pt !important;
                        line-height: 1.6 !important;
                        text-align: justify !important;
                    }
                    
                    /* Proper list styling */
                    ul, ol {
                        padding-left: 1.5em !important;
                        margin-left: 0 !important;
                    }
                    
                    li {
                        padding-left: 0.5em !important;
                    }
                    
                    h1, h2, h3, h4, h5, h6 {
                        page-break-after: avoid;
                    }
                    
                    section {
                        page-break-inside: avoid;
                    }
                }
            `}</style>
        </div>
    );
}
