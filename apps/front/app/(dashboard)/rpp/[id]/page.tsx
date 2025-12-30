'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { rppApi } from '@/lib/api';
import { RPP, DimensiProfilLulusanLabels } from '@/types/rpp';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ChevronLeft, Printer, Edit, Copy } from 'lucide-react';

export default function RppDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [rpp, setRpp] = useState<RPP | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRpp();
    }, [params.id]);

    const fetchRpp = async () => {
        try {
            setLoading(true);
            const data = await rppApi.getOne(params.id);
            setRpp(data);
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
                <div className="flex gap-2">
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
                        <h1 className="text-xl font-bold mb-1">SMA NEGERI 1 BANDONGAN</h1>
                        <h2 className="text-lg font-bold mb-1">RENCANA PELAKSANAAN PEMBELAJARAN (RPP)</h2>
                        <h3 className="text-base font-bold mb-4">PENDEKATAN DEEP LEARNING</h3>
                    </div>

                    {/* Header Information Table */}
                    <div className="mb-8 text-sm">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="py-1 w-1/4">Nama Guru</td>
                                    <td className="py-1 w-1">:</td>
                                    <td className="py-1">{rpp.guru?.nama || rpp.namaGuru || '...'}</td>
                                </tr>
                                <tr>
                                    <td className="py-1">Mata Pelajaran</td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">{rpp.mataPelajaran?.nama || '...'}</td>
                                    <td className="py-1 pl-8">Materi</td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">{rpp.materi}</td>
                                </tr>
                                <tr>
                                    <td className="py-1">Fase/Kelas/Smt</td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">{rpp.fase || '...'}</td>
                                    <td className="py-1 pl-8">Alokasi Waktu</td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">{rpp.alokasiWaktu} menit</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-center mt-2 font-semibold">
                            TAHUN AJARAN {rpp.tahunAjaran || '2025/2026'}
                        </p>
                    </div>

                    {/* I. IDENTIFIKASI */}
                    <section className="mb-6">
                        <h3 className="font-bold text-base mb-3">I. IDENTIFIKASI</h3>

                        <div className="mb-3">
                            <h4 className="font-semibold text-sm mb-1">A. Peserta Didik:</h4>
                            <p className="text-sm text-justify whitespace-pre-wrap">
                                {rpp.identifikasiPesertaDidik || 'Belum diisi'}
                            </p>
                        </div>

                        <div className="mb-3">
                            <h4 className="font-semibold text-sm mb-1">B. Materi Pembelajaran:</h4>
                            <p className="text-sm text-justify whitespace-pre-wrap">
                                {rpp.identifikasiMateri || 'Belum diisi'}
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
                            <p className="text-sm text-justify whitespace-pre-wrap">{rpp.capaianPembelajaran}</p>
                        </div>

                        {rpp.lintasDisiplinIlmu && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">B. Lintas Disiplin Ilmu:</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{rpp.lintasDisiplinIlmu}</p>
                            </div>
                        )}

                        <div className="mb-3">
                            <h4 className="font-semibold text-sm mb-1">C. Tujuan Pembelajaran:</h4>
                            <ul className="text-sm list-decimal list-inside">
                                {(rpp.tujuanPembelajaran as string[]).map((tujuan, idx) => (
                                    <li key={idx} className="mb-1">{tujuan}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-3">
                            <h4 className="font-semibold text-sm mb-1">D. Topik Pembelajaran:</h4>
                            <p className="text-sm text-justify whitespace-pre-wrap">{rpp.topikPembelajaran}</p>
                        </div>

                        {rpp.praktikPedagogik && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">E. Praktik Pedagogik:</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{rpp.praktikPedagogik}</p>
                            </div>
                        )}

                        {rpp.kemitraanPembelajaran && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">F. Kemitraan Pembelajaran:</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{rpp.kemitraanPembelajaran}</p>
                            </div>
                        )}

                        {rpp.lingkunganPembelajaran && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">G. Lingkungan Pembelajaran:</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{rpp.lingkunganPembelajaran}</p>
                            </div>
                        )}

                        {rpp.pemanfaatanDigital && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">H. Pemanfaatan Digital:</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{rpp.pemanfaatanDigital}</p>
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
                                    {(rpp.kegiatanAwal as any).kegiatan}
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
                                        {(rpp.kegiatanMemahami as any).kegiatan}
                                    </p>
                                </div>
                            )}

                            {rpp.kegiatanMengaplikasi && (
                                <div className="mb-3 ml-4">
                                    <h5 className="font-semibold text-sm mb-1">
                                        2. Mengaplikasi ({(rpp.kegiatanMengaplikasi as any).prinsip?.join(', ') || ''})
                                    </h5>
                                    <p className="text-sm text-justify whitespace-pre-wrap">
                                        {(rpp.kegiatanMengaplikasi as any).kegiatan}
                                    </p>
                                </div>
                            )}

                            {rpp.kegiatanMerefleksi && (
                                <div className="mb-3 ml-4">
                                    <h5 className="font-semibold text-sm mb-1">
                                        3. Merefleksi ({(rpp.kegiatanMerefleksi as any).prinsip?.join(', ') || ''})
                                    </h5>
                                    <p className="text-sm text-justify whitespace-pre-wrap">
                                        {(rpp.kegiatanMerefleksi as any).kegiatan}
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
                                    {(rpp.kegiatanPenutup as any).kegiatan}
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
                                <p className="text-sm text-justify whitespace-pre-wrap">{rpp.asesmenAwal}</p>
                            </div>
                        )}

                        {rpp.asesmenProses && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">B. Asesmen pada Proses Pembelajaran</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{rpp.asesmenProses}</p>
                            </div>
                        )}

                        {rpp.asesmenAkhir && (
                            <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-1">C. Asesmen pada Akhir Pembelajaran</h4>
                                <p className="text-sm text-justify whitespace-pre-wrap">{rpp.asesmenAkhir}</p>
                            </div>
                        )}
                    </section>

                    {/* Signature Section */}
                    <div className="mt-16">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="text-center">
                                <p className="text-sm">Mengetahui,</p>
                                <p className="text-sm font-semibold mb-16">Kepala Sekolah</p>
                                <p className="text-sm font-semibold">_______________________</p>
                                <p className="text-sm">NIP. </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm">Bandongan, _______________</p>
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
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:border-0 {
                        border: 0 !important;
                    }
                    @page {
                        size: A4;
                        margin: 2cm;
                    }
                }
            `}</style>
        </div>
    );
}
