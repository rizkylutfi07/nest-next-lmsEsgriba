'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { rppApi, mataPelajaranApi, kelasApi } from '@/lib/api';
import { RPP, UpdateRPPDto, DimensiProfilLulusan, DimensiProfilLulusanLabels } from '@/types/rpp';
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
import { ChevronLeft, ChevronRight, FileText, Save } from 'lucide-react';

const STEPS = [
    { id: 1, title: 'Header', description: 'Informasi Dasar RPP' },
    { id: 2, title: 'Identifikasi', description: 'Identifikasi Peserta Didik & Materi' },
    { id: 3, title: 'Desain Pembelajaran', description: 'Tujuan & Strategi Pembelajaran' },
    { id: 4, title: 'Pengalaman Belajar', description: 'Kegiatan Pembelajaran' },
    { id: 5, title: 'Asesmen', description: 'Asesmen Pembelajaran' },
];

const PRINSIP_PEMBELAJARAN = ['Berkesadaran (Mindful)', 'Bermakna (Meaningful)', 'Menggembirakan (Joyful)'];

export default function EditRppPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mataPelajaranList, setMataPelajaranList] = useState<any[]>([]);
    const [kelasList, setKelasList] = useState<any[]>([]);
    const [formData, setFormData] = useState<Partial<UpdateRPPDto>>({});

    useEffect(() => {
        fetchMataPelajaran();
        fetchKelas();
        fetchRpp();
    }, [id]);

    const fetchRpp = async () => {
        try {
            setLoading(true);
            const data: RPP = await rppApi.getOne(id);

            // Convert RPP data to form data
            setFormData({
                kode: data.kode,
                namaGuru: data.namaGuru,
                mataPelajaranId: data.mataPelajaranId,
                materi: data.materi,
                fase: data.fase,
                alokasiWaktu: data.alokasiWaktu,
                tahunAjaran: data.tahunAjaran,
                identifikasiPesertaDidik: data.identifikasiPesertaDidik,
                identifikasiMateri: data.identifikasiMateri,
                dimensiProfilLulusan: data.dimensiProfilLulusan as string[],
                capaianPembelajaran: data.capaianPembelajaran,
                lintasDisiplinIlmu: data.lintasDisiplinIlmu,
                tujuanPembelajaran: data.tujuanPembelajaran as string[],
                topikPembelajaran: data.topikPembelajaran,
                praktikPedagogik: data.praktikPedagogik,
                kemitraanPembelajaran: data.kemitraanPembelajaran,
                lingkunganPembelajaran: data.lingkunganPembelajaran,
                pemanfaatanDigital: data.pemanfaatanDigital,
                kegiatanAwal: data.kegiatanAwal as any,
                kegiatanMemahami: data.kegiatanMemahami as any,
                kegiatanMengaplikasi: data.kegiatanMengaplikasi as any,
                kegiatanMerefleksi: data.kegiatanMerefleksi as any,
                kegiatanPenutup: data.kegiatanPenutup as any,
                asesmenAwal: data.asesmenAwal,
                asesmenProses: data.asesmenProses,
                asesmenAkhir: data.asesmenAkhir,
                kelasIds: data.rppKelas?.map(rk => rk.kelasId) || [],
            });
        } catch (error: any) {
            toast.error(error.message || 'Gagal memuat RPP');
            router.push('/rpp');
        } finally {
            setLoading(false);
        }
    };

    const fetchMataPelajaran = async () => {
        try {
            const response = await mataPelajaranApi.getAll({ limit: 100 });
            setMataPelajaranList(response.data || []);
        } catch (error) {
            console.error('Failed to fetch mata pelajaran:', error);
        }
    };

    const fetchKelas = async () => {
        try {
            const response = await kelasApi.getAll({ limit: 100 });
            setKelasList(response.data || []);
        } catch (error) {
            console.error('Failed to fetch kelas:', error);
        }
    };

    const handleSubmit = async (isDraft: boolean) => {
        try {
            setSaving(true);
            const payload = {
                ...formData,
                isPublished: !isDraft,
            };
            await rppApi.update(id, payload);
            toast.success('RPP berhasil diupdate');
            router.push('/rpp');
        } catch (error: any) {
            toast.error(error.message || 'Gagal mengupdate RPP');
        } finally {
            setSaving(false);
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

                        <div>
                            <Label>Dimensi Profil Lulusan *</Label>
                            <div className="space-y-2">
                                {Object.entries(DimensiProfilLulusanLabels).map(([key, label]) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`dpl-${key}`}
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
                                        <Label htmlFor={`dpl-${key}`} className="text-sm font-normal">
                                            {label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
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
                                placeholder="Identifikasi kesiapan peserta didik sebelum belajar..."
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label htmlFor="identifikasiMateri">B. Identifikasi Materi Pembelajaran</Label>
                            <Textarea
                                id="identifikasiMateri"
                                value={formData.identifikasiMateri || ''}
                                onChange={(e) => updateFormData('identifikasiMateri', e.target.value)}
                                placeholder="Tuliskan analisis materi pelajaran..."
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
                                placeholder="Disiplin ilmu yang relevan..."
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label>C. Tujuan Pembelajaran *</Label>
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
                                placeholder="Topik pembelajaran..."
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
                                    placeholder="Model/Strategi/Metode pembelajaran..."
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="kemitraanPembelajaran">F. Kemitraan Pembelajaran</Label>
                                <Textarea
                                    id="kemitraanPembelajaran"
                                    value={formData.kemitraanPembelajaran || ''}
                                    onChange={(e) => updateFormData('kemitraanPembelajaran', e.target.value)}
                                    placeholder="Mitra kerjasama..."
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
                                    placeholder="Ruang fisik, ruang virtual..."
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="pemanfaatanDigital">H. Pemanfaatan Digital</Label>
                                <Textarea
                                    id="pemanfaatanDigital"
                                    value={formData.pemanfaatanDigital || ''}
                                    onChange={(e) => updateFormData('pemanfaatanDigital', e.target.value)}
                                    placeholder="Teknologi digital..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        {['kegiatanAwal', 'kegiatanMemahami', 'kegiatanMengaplikasi', 'kegiatanMerefleksi', 'kegiatanPenutup'].map((field, idx) => {
                            const labels = ['A. Kegiatan Awal', 'B.1. Memahami', 'B.2. Mengaplikasi', 'B.3. Merefleksi', 'C. Penutup'];
                            return (
                                <Card key={field}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{labels[idx]}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <Label>Prinsip Pembelajaran</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {['Berkesadaran (Mindful)', 'Bermakna (Meaningful)', 'Menggembirakan (Joyful)'].map((prinsip) => {
                                                    const currentPrinsip = (formData[field as keyof UpdateRPPDto] as any)?.prinsip || [];
                                                    return (
                                                        <div key={prinsip} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`${field}-${prinsip}`}
                                                                checked={currentPrinsip.includes(prinsip)}
                                                                onCheckedChange={(checked) => {
                                                                    const current = formData[field as keyof UpdateRPPDto] as any || { prinsip: [], kegiatan: '' };
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
                                                value={(formData[field as keyof UpdateRPPDto] as any)?.kegiatan || ''}
                                                onChange={(e) => {
                                                    const current = formData[field as keyof UpdateRPPDto] as any || { prinsip: [], kegiatan: '' };
                                                    updateFormData(field, {
                                                        ...current,
                                                        kegiatan: e.target.value,
                                                    });
                                                }}
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
                        <div>
                            <Label htmlFor="asesmenAwal">A. Asesmen pada Awal Pembelajaran</Label>
                            <Textarea
                                id="asesmenAwal"
                                value={formData.asesmenAwal || ''}
                                onChange={(e) => updateFormData('asesmenAwal', e.target.value)}
                                placeholder="Metode asesmen di awal pembelajaran..."
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label htmlFor="asesmenProses">B. Asesmen pada Proses Pembelajaran</Label>
                            <Textarea
                                id="asesmenProses"
                                value={formData.asesmenProses || ''}
                                onChange={(e) => updateFormData('asesmenProses', e.target.value)}
                                placeholder="Metode asesmen selama proses..."
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label htmlFor="asesmenAkhir">C. Asesmen pada Akhir Pembelajaran</Label>
                            <Textarea
                                id="asesmenAkhir"
                                value={formData.asesmenAkhir || ''}
                                onChange={(e) => updateFormData('asesmenAkhir', e.target.value)}
                                placeholder="Metode asesmen di akhir..."
                                rows={4}
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
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

    // Use the same render function as create page
    // For brevity, I'll note that this should contain the exact same renderStepContent logic
    // as the create page but using formData state

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => router.back()}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <FileText className="h-6 w-6" />
                                Edit RPP Deep Learning
                            </CardTitle>
                            <CardDescription>
                                Kode: {formData.kode}
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
                                        disabled={saving}
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Simpan sebagai Draft
                                    </Button>
                                    <Button onClick={() => handleSubmit(false)} disabled={saving}>
                                        Update & Publikasikan
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setCurrentStep(prev => Math.min(STEPS.length, prev + 1))}>
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
