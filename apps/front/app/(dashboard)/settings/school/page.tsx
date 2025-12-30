'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { settingsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Loader2, Building2, User, Globe, Instagram, Facebook, Youtube } from 'lucide-react';

interface SchoolSettings {
    school_name: string;
    school_address: string;
    school_phone: string;
    school_email: string;
    school_website: string;
    school_principal_name: string;
    school_principal_nip: string;
    school_logo: string;
    school_instagram: string;
    school_facebook: string;
    school_youtube: string;
}

const defaultSettings: SchoolSettings = {
    school_name: '',
    school_address: '',
    school_phone: '',
    school_email: '',
    school_website: '',
    school_principal_name: '',
    school_principal_nip: '',
    school_logo: '',
    school_instagram: '',
    school_facebook: '',
    school_youtube: '',
};

export default function SchoolSettingsPage() {
    const [settings, setSettings] = useState<SchoolSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await settingsApi.getSchoolSettings();
            setSettings({ ...defaultSettings, ...data });
        } catch (error: any) {
            toast.error(error.message || 'Gagal memuat pengaturan');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await settingsApi.updateSchoolSettings(settings as unknown as Record<string, string>);
            toast.success('Pengaturan berhasil disimpan');
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan pengaturan');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: keyof SchoolSettings, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat pengaturan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Identitas Sekolah</h1>
                    <p className="text-muted-foreground">
                        Kelola informasi profil sekolah yang ditampilkan di dokumen dan aplikasi
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    Simpan
                </Button>
            </div>

            <div className="space-y-6">
                {/* Informasi Sekolah */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Informasi Sekolah
                        </CardTitle>
                        <CardDescription>Informasi dasar tentang sekolah</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <Label>Nama Sekolah</Label>
                                <Input
                                    value={settings.school_name}
                                    onChange={(e) => handleChange('school_name', e.target.value)}
                                    placeholder="Contoh: SMA Negeri 1 Bandongan"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Alamat</Label>
                                <Input
                                    value={settings.school_address}
                                    onChange={(e) => handleChange('school_address', e.target.value)}
                                    placeholder="Alamat lengkap sekolah"
                                />
                            </div>
                            <div>
                                <Label>Telepon</Label>
                                <Input
                                    value={settings.school_phone}
                                    onChange={(e) => handleChange('school_phone', e.target.value)}
                                    placeholder="(0293) 123456"
                                />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={settings.school_email}
                                    onChange={(e) => handleChange('school_email', e.target.value)}
                                    placeholder="info@sekolah.sch.id"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Website</Label>
                                <Input
                                    value={settings.school_website}
                                    onChange={(e) => handleChange('school_website', e.target.value)}
                                    placeholder="https://sekolah.sch.id"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Logo (URL)</Label>
                                <Input
                                    value={settings.school_logo}
                                    onChange={(e) => handleChange('school_logo', e.target.value)}
                                    placeholder="/logo.png atau https://..."
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Kepala Sekolah */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Kepala Sekolah
                        </CardTitle>
                        <CardDescription>Informasi kepala sekolah</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Nama Kepala Sekolah</Label>
                                <Input
                                    value={settings.school_principal_name}
                                    onChange={(e) => handleChange('school_principal_name', e.target.value)}
                                    placeholder="Dr. Ahmad, M.Pd"
                                />
                            </div>
                            <div>
                                <Label>NIP</Label>
                                <Input
                                    value={settings.school_principal_nip}
                                    onChange={(e) => handleChange('school_principal_nip', e.target.value)}
                                    placeholder="196801012000011001"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Media Sosial */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Media Sosial
                        </CardTitle>
                        <CardDescription>Akun media sosial sekolah</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label className="flex items-center gap-2">
                                    <Instagram className="h-4 w-4" />
                                    Instagram
                                </Label>
                                <Input
                                    value={settings.school_instagram}
                                    onChange={(e) => handleChange('school_instagram', e.target.value)}
                                    placeholder="@username"
                                />
                            </div>
                            <div>
                                <Label className="flex items-center gap-2">
                                    <Facebook className="h-4 w-4" />
                                    Facebook
                                </Label>
                                <Input
                                    value={settings.school_facebook}
                                    onChange={(e) => handleChange('school_facebook', e.target.value)}
                                    placeholder="@pagename"
                                />
                            </div>
                            <div>
                                <Label className="flex items-center gap-2">
                                    <Youtube className="h-4 w-4" />
                                    YouTube
                                </Label>
                                <Input
                                    value={settings.school_youtube}
                                    onChange={(e) => handleChange('school_youtube', e.target.value)}
                                    placeholder="@channel"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
