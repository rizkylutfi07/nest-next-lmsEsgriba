'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { rppApi, mataPelajaranApi, kelasApi } from '@/lib/api';
import { CreateRPPDto, DimensiProfilLulusan, DimensiProfilLulusanLabels } from '@/types/rpp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, FileText, Save, Sparkles, Loader2 } from 'lucide-react';
import { useAiRppGenerator } from '@/hooks/use-ai-rpp-generator';

const STEPS = [
    { id: 1, title: 'Header', description: 'Informasi Dasar RPP' },
    { id: 2, title: 'Identifikasi', description: 'Identifikasi Peserta Didik & Materi' },
    { id: 3, title: 'Desain Pembelajaran', description: 'Tujuan & Strategi Pembelajaran' },
    { id: 4, title: 'Pengalaman Belajar', description: 'Kegiatan Pembelajaran' },
    { id: 5, title: 'Asesmen', description: 'Asesmen Pembelajaran' },
];

const PRINSIP_PEMBELAJARAN = ['Berkesadaran (Mindful)', 'Bermakna (Meaningful)', 'Menggembirakan (Joyful)'];

export default function CreateRppPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [mataPelajaranList, setMataPelajaranList] = useState<any[]>([]);
    const [kelasList, setKelasList] = useState<any[]>([]);
    const { generateRpp, isGenerating, error: aiError } = useAiRppGenerator();

    const [formData, setFormData] = useState<Partial<CreateRPPDto>>({
        kode: '',
        mataPelajaranId: '',
        materi: '',
        alokasiWaktu: 90,
        capaianPembelajaran: '',
        tujuanPembelajaran: [''],
        topikPembelajaran: '',
        dimensiProfilLulusan: [],
        kelasIds: [],
    });

    useEffect(() => {
        fetchMataPelajaran();
        fetchKelas();
    }, []);

    const fetchMataPelajaran = async () => {
        try {
            const response: any = await mataPelajaranApi.getAll({ limit: 100 });
            setMataPelajaranList(response.data || []);
        } catch (error) {
            console.error('Failed to fetch mata pelajaran:', error);
        }
    };

    const fetchKelas = async () => {
        try {
            const response: any = await kelasApi.getAll({ limit: 100 });
            setKelasList(response.data || []);
        } catch (error) {
            console.error('Failed to fetch kelas:', error);
        }
    };

    const handleSubmit = async (isDraft: boolean) => {
        try {
            setLoading(true);
            const payload = {
                ...formData,
                isPublished: !isDraft,
            };
            await rppApi.create(payload);
            toast.success(isDraft ? 'RPP disimpan sebagai draft' : 'RPP berhasil dipublikasikan');
            router.push('/rpp');
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan RPP');
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addTujuanPembelajaran = () => {
        setFormData(prev => ({
            ...prev,
            tujuanPembelajaran: [...(prev.tujuanPembelajaran || []), ''],
        }));
    };

    const updateTujuanPembelajaran = (index: number, value: string) => {
        const updated = [...(formData.tujuanPembelajaran || [])];
        updated[index] = value;
        setFormData(prev => ({ ...prev, tujuanPembelajaran: updated }));
    };

    const removeTujuanPembelajaran = (index: number) => {
        const updated = (formData.tujuanPembelajaran || []).filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, tujuanPembelajaran: updated }));
    };

    const handleGenerateWithAI = async () => {
        // Validate required fields
        if (!formData.mataPelajaranId || !formData.materi || !formData.alokasiWaktu) {
            toast.error('Mohon isi Mata Pelajaran, Materi, dan Alokasi Waktu terlebih dahulu');
            return;
        }
        if (!formData.dimensiProfilLulusan || formData.dimensiProfilLulusan.length === 0) {
            toast.error('Mohon pilih minimal satu Dimensi Profil Lulusan');
            return;
        }

        const mataPelajaran = mataPelajaranList.find(mp => mp.id === formData.mataPelajaranId);
        if (!mataPelajaran) {
            toast.error('Mata Pelajaran tidak ditemukan');
            return;
        }

        toast.info('Generating RPP with AI... Ini mungkin memakan waktu 10-30 detik.');

        const generated = await generateRpp({
            mataPelajaran: mataPelajaran.nama,
            materi: formData.materi!,
            fase: formData.fase || 'XI',
            alokasiWaktu: formData.alokasiWaktu!,
            dimensiProfilLulusan: formData.dimensiProfilLulusan!,
        });

        if (generated) {
            // Auto-fill form with AI generated content
            setFormData(prev => ({
                ...prev,
                identifikasiPesertaDidik: generated.identifikasiPesertaDidik,
                identifikasiMateri: generated.identifikasiMateri,
                capaianPembelajaran: generated.capaianPembelajaran,
                lintasDisiplinIlmu: generated.lintasDisiplinIlmu,
                tujuanPembelajaran: generated.tujuanPembelajaran,
                topikPembelajaran: generated.topikPembelajaran,
                praktikPedagogik: generated.praktikPedagogik,
                kemitraanPembelajaran: generated.kemitraanPembelajaran,
                lingkunganPembelajaran: generated.lingkunganPembelajaran,
                pemanfaatanDigital: generated.pemanfaatanDigital,
                kegiatanAwal: generated.kegiatanAwal,
                kegiatanMemahami: generated.kegiatanMemahami,
                kegiatanMengaplikasi: generated.kegiatanMengaplikasi,
                kegiatanMerefleksi: generated.kegiatanMerefleksi,
                kegiatanPenutup: generated.kegiatanPenutup,
                asesmenAwal: generated.asesmenAwal,
                asesmenProses: generated.asesmenProses,
                asesmenAkhir: generated.asesmenAkhir,
            }));
            toast.success('✨ RPP berhasil di-generate! Silakan review dan edit sesuai kebutuhan.');
        } else if (aiError) {
            toast.error(aiError);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="kode">Kode RPP *</Label>
                                <Input
                                    id="kode"
                                    value={formData.kode}
                                    onChange={(e) => updateFormData('kode', e.target.value)}
                                    placeholder="RPP-MTK-001"
                                />
                            </div>
                            <div>
                                <Label htmlFor="mataPelajaranId">Mata Pelajaran *</Label>
                                <Select
                                    value={formData.mataPelajaranId}
                                    onValueChange={(value) => updateFormData('mataPelajaranId', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Mata Pelajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mataPelajaranList.map((mp) => (
                                            <SelectItem key={mp.id} value={mp.id}>
                                                {mp.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="materi">Materi *</Label>
                            <Input
                                id="materi"
                                value={formData.materi}
                                onChange={(e) => updateFormData('materi', e.target.value)}
                                placeholder="Contoh: Trigonometri"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="fase">Fase/Kelas/Semester</Label>
                                <Input
                                    id="fase"
                                    value={formData.fase || ''}
                                    onChange={(e) => updateFormData('fase', e.target.value)}
                                    placeholder="Fase E / XI / 1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="alokasiWaktu">Alokasi Waktu (menit) *</Label>
                                <Input
                                    id="alokasiWaktu"
                                    type="number"
                                    value={formData.alokasiWaktu}
                                    onChange={(e) => updateFormData('alokasiWaktu', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="tahunAjaran">Tahun Ajaran</Label>
                                <Input
                                    id="tahunAjaran"
                                    value={formData.tahunAjaran || ''}
                                    onChange={(e) => updateFormData('tahunAjaran', e.target.value)}
                                    placeholder="2025/2026"
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Kelas yang Menggunakan RPP Ini</Label>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {kelasList.map((kelas) => (
                                    <div key={kelas.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`kelas-${kelas.id}`}
                                            checked={(formData.kelasIds || []).includes(kelas.id)}
                                            onCheckedChange={(checked) => {
                                                const current = formData.kelasIds || [];
                                                updateFormData(
                                                    'kelasIds',
                                                    checked
                                                        ? [...current, kelas.id]
                                                        : current.filter(id => id !== kelas.id)
                                                );
                                            }}
                                        />
                                        <Label htmlFor={`kelas-${kelas.id}`} className="text-sm font-normal">
                                            {kelas.nama}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dimensi Profil Lulusan - moved from Step 2 */}
                        <div>
                            <Label>Dimensi Profil Lulusan *</Label>
                            <p className="text-sm text-gray-600 mb-2">Pilih minimal 1 dimensi profil lulusan (diperlukan untuk AI generation)</p>
                            <div className="space-y-2">
                                {Object.entries(DimensiProfilLulusanLabels).map(([key, label]) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`dpl-step1-${key}`}
                                            checked={(formData.dimensiProfilLulusan || []).includes(key)}
                                            onCheckedChange={(checked) => {
                                                const current = formData.dimensiProfilLulusan || [];
                                                updateFormData(
                                                    'dimensiProfilLulusan',
                                                    checked
                                                        ? [...current, key]
                                                        : current.filter(d => d !== key)
                                                );
                                            }}
                                        />
                                        <Label htmlFor={`dpl-step1-${key}`} className="text-sm font-normal">
                                            {label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Generator Button */}
                        <div className="pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleGenerateWithAI}
                                disabled={isGenerating || !formData.mataPelajaranId || !formData.materi}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Generating dengan AI...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        ✨ Generate RPP dengan AI
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                AI akan otomatis mengisi semua field berdasarkan informasi di atas.
                                Anda masih bisa mengedit hasilnya sebelum menyimpan.
                            </p>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="identifikasiPesertaDidik">A. Identifikasi Peserta Didik</Label>
                            <Textarea
                                id="identifikasiPesertaDidik"
                                value={formData.identifikasiPesertaDidik || ''}
                                onChange={(e) => updateFormData('identifikasiPesertaDidik', e.target.value)}
                                placeholder="Identifikasi kesiapan peserta didik sebelum belajar, seperti pengetahuan awal, minat, latar belakang, dan kebutuhan belajar..."
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label htmlFor="identifikasiMateri">B. Identifikasi Materi Pembelajaran</Label>
                            <Textarea
                                id="identifikasiMateri"
                                value={formData.identifikasiMateri || ''}
                                onChange={(e) => updateFormData('identifikasiMateri', e.target.value)}
                                placeholder="Tuliskan analisis materi pelajaran seperti jenis pengetahuan yang akan dicapai, relevansi dengan kehidupan nyata, tingkat kesulitan..."
                                rows={4}
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="capaianPembelajaran">A. Capaian Pembelajaran *</Label>
                            <Textarea
                                id="capaianPembelajaran"
                                value={formData.capaianPembelajaran}
                                onChange={(e) => updateFormData('capaianPembelajaran', e.target.value)}
                                placeholder="Tuliskan capaian pembelajaran sesuai fase..."
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="lintasDisiplinIlmu">B. Lintas Disiplin Ilmu</Label>
                            <Textarea
                                id="lintasDisiplinIlmu"
                                value={formData.lintasDisiplinIlmu || ''}
                                onChange={(e) => updateFormData('lintasDisiplinIlmu', e.target.value)}
                                placeholder="Tuliskan disiplin ilmu dan/atau mata pelajaran yang relevan..."
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label>C. Tujuan Pembelajaran *</Label>
                            <p className="text-sm text-gray-600 mb-2">
                                Jika lebih dari satu pertemuan, tuliskan tujuan pembelajaran setiap pertemuannya
                            </p>
                            {(formData.tujuanPembelajaran || []).map((tujuan, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        value={tujuan}
                                        onChange={(e) => updateTujuanPembelajaran(index, e.target.value)}
                                        placeholder={`Tujuan ${index + 1}...`}
                                    />
                                    {index > 0 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeTujuanPembelajaran(index)}
                                        >
                                            Hapus
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={addTujuanPembelajaran}>
                                + Tambah Tujuan
                            </Button>
                        </div>

                        <div>
                            <Label htmlFor="topikPembelajaran">D. Topik Pembelajaran *</Label>
                            <Textarea
                                id="topikPembelajaran"
                                value={formData.topikPembelajaran}
                                onChange={(e) => updateFormData('topikPembelajaran', e.target.value)}
                                placeholder="Tuliskan topik pembelajaran yang relevan dengan capaian dan tujuan pembelajaran..."
                                rows={2}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="praktikPedagogik">E. Praktik Pedagogik</Label>
                                <Textarea
                                    id="praktikPedagogik"
                                    value={formData.praktikPedagogik || ''}
                                    onChange={(e) => updateFormData('praktikPedagogik', e.target.value)}
                                    placeholder="Model/Strategi/Metode pembelajaran (PBL, Project-based, Inkuiri, dll)..."
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="kemitraanPembelajaran">F. Kemitraan Pembelajaran</Label>
                                <Textarea
                                    id="kemitraanPembelajaran"
                                    value={formData.kemitraanPembelajaran || ''}
                                    onChange={(e) => updateFormData('kemitraanPembelajaran', e.target.value)}
                                    placeholder="Mitra kerjasama (guru lain, orang tua, komunitas, DUDI, dll)..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="lingkunganPembelajaran">G. Lingkungan Pembelajaran</Label>
                                <Textarea
                                    id="lingkunganPembelajaran"
                                    value={formData.lingkunganPembelajaran || ''}
                                    onChange={(e) => updateFormData('lingkunganPembelajaran', e.target.value)}
                                    placeholder="Ruang fisik, ruang virtual, budaya belajar (sekolah, LMS, dll)..."
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="pemanfaatanDigital">H. Pemanfaatan Digital</Label>
                                <Textarea
                                    id="pemanfaatanDigital"
                                    value={formData.pemanfaatanDigital || ''}
                                    onChange={(e) => updateFormData('pemanfaatanDigital', e.target.value)}
                                    placeholder="Teknologi digital yang digunakan (perpustakaan digital, forum daring, dll)..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <p className="text-sm text-gray-600">
                            Kegiatan pembelajaran berbasis <strong>mindful</strong> (berkesadaran), <strong>meaningful</strong> (bermakna), dan <strong>joyful</strong> (menyenangkan)
                        </p>

                        {['kegiatanAwal', 'kegiatanMemahami', 'kegiatanMengaplikasi', 'kegiatanMerefleksi', 'kegiatanPenutup'].map((field, idx) => {
                            const labels = ['A. Kegiatan Awal', 'B.1. Memahami', 'B.2. Mengaplikasi', 'B.3. Merefleksi', 'C. Penutup'];
                            const placeholders = [
                                'Pembuka, orientasi, apersepsi, motivasi...',
                                'Kegiatan memfasilitasi peserta didik memahami konsep...',
                                'Kegiatan mengaplikasikan pemahaman ke konteks nyata...',
                                'Kegiatan mengevaluasi dan memaknai proses belajar...',
                                'Umpan balik, kesimpulan, perencanaan pembelajaran selanjutnya...',
                            ];

                            return (
                                <Card key={field}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{labels[idx]}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <Label>Prinsip Pembelajaran</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {PRINSIP_PEMBELAJARAN.map((prinsip) => {
                                                    const currentPrinsip = (formData[field as keyof CreateRPPDto] as any)?.prinsip || [];
                                                    return (
                                                        <div key={prinsip} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`${field}-${prinsip}`}
                                                                checked={currentPrinsip.includes(prinsip)}
                                                                onCheckedChange={(checked) => {
                                                                    const current = formData[field as keyof CreateRPPDto] as any || { prinsip: [], kegiatan: '' };
                                                                    updateFormData(field, {
                                                                        ...current,
                                                                        prinsip: checked
                                                                            ? [...current.prinsip, prinsip]
                                                                            : current.prinsip.filter((p: string) => p !== prinsip),
                                                                    });
                                                                }}
                                                            />
                                                            <Label htmlFor={`${field}-${prinsip}`} className="text-sm font-normal">
                                                                {prinsip}
                                                            </Label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Deskripsi Kegiatan</Label>
                                            <Textarea
                                                value={(formData[field as keyof CreateRPPDto] as any)?.kegiatan || ''}
                                                onChange={(e) => {
                                                    const current = formData[field as keyof CreateRPPDto] as any || { prinsip: [], kegiatan: '' };
                                                    updateFormData(field, {
                                                        ...current,
                                                        kegiatan: e.target.value,
                                                    });
                                                }}
                                                placeholder={placeholders[idx]}
                                                rows={4}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 mb-4">
                            Asesmen dalam pembelajaran mendalam disesuaikan dengan <strong>assessment as learning</strong>, <strong>assessment for learning</strong>, dan <strong>assessment of learning</strong>
                        </p>

                        <div>
                            <Label htmlFor="asesmenAwal">A. Asesmen pada Awal Pembelajaran</Label>
                            <Textarea
                                id="asesmenAwal"
                                value={formData.asesmenAwal || ''}
                                onChange={(e) => updateFormData('asesmenAwal', e.target.value)}
                                placeholder="Metode asesmen di awal pembelajaran (tes diagnostik, observasi, dll)..."
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label htmlFor="asesmenProses">B. Asesmen pada Proses Pembelajaran</Label>
                            <Textarea
                                id="asesmenProses"
                                value={formData.asesmenProses || ''}
                                onChange={(e) => updateFormData('asesmenProses', e.target.value)}
                                placeholder="Metode asesmen selama proses (observasi, peer assessment, self assessment, dll)..."
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label htmlFor="asesmenAkhir">C. Asesmen pada Akhir Pembelajaran</Label>
                            <Textarea
                                id="asesmenAkhir"
                                value={formData.asesmenAkhir || ''}
                                onChange={(e) => updateFormData('asesmenAkhir', e.target.value)}
                                placeholder="Metode asesmen di akhir (tes tertulis, portofolio, penilaian proyek, dll)..."
                                rows={4}
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <FileText className="h-6 w-6" />
                                Buat RPP Deep Learning Baru
                            </CardTitle>
                            <CardDescription>
                                Rencana Pelaksanaan Pembelajaran Pendekatan Deep Learning
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Steps indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {STEPS.map((step, index) => (
                                <div key={step.id} className="flex-1">
                                    <div className="flex items-center">
                                        <div
                                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : 'border-gray-300 text-gray-400'
                                                }`}
                                        >
                                            {step.id}
                                        </div>
                                        {index < STEPS.length - 1 && (
                                            <div
                                                className={`flex-1 h-1 mx-2 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                                                    }`}
                                            />
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm font-medium">{step.title}</p>
                                        <p className="text-xs text-gray-500 hidden sm:block">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step content */}
                    <div className="min-h-[400px]">
                        {renderStepContent()}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                            disabled={currentStep === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Sebelumnya
                        </Button>

                        <div className="flex gap-2">
                            {currentStep === STEPS.length ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleSubmit(true)}
                                        disabled={loading}
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Simpan sebagai Draft
                                    </Button>
                                    <Button
                                        onClick={() => handleSubmit(false)}
                                        disabled={loading}
                                    >
                                        Publikasikan
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => setCurrentStep(prev => Math.min(STEPS.length, prev + 1))}
                                >
                                    Selanjutnya
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
