"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BookOpen, Plus, Pencil, Trash2, Eye, Download, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { materiApi, mataPelajaranApi, kelasApi, guruApi } from "@/lib/api";
import { useRole } from "../role-context";

const TIPE_MATERI = [
    { value: "DOKUMEN", label: "Dokumen", icon: "📄" },
    { value: "VIDEO", label: "Video", icon: "🎥" },
    { value: "LINK", label: "Link/URL", icon: "🔗" },
    { value: "GAMBAR", label: "Gambar", icon: "🖼️" },
    { value: "TEKS", label: "Teks", icon: "📝" },
];

export default function MateriManagementPage() {
    const { user, role, ready } = useRole();
    const [materiList, setMateriList] = useState<any[]>([]);
    const [mataPelajaranList, setMataPelajaranList] = useState<any[]>([]);
    const [kelasList, setKelasList] = useState<any[]>([]);
    const [guruList, setGuruList] = useState<any[]>([]);
    const [filteredGuruList, setFilteredGuruList] = useState<any[]>([]);
    const [guruSearch, setGuruSearch] = useState("");
    const [mapelSearch, setMapelSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            judul: "",
            deskripsi: "",
            tipe: "DOKUMEN",
            konten: "",
            mataPelajaranId: "",
            kelasId: "",
            guruId: "", // For ADMIN to select
            isPublished: true,
        },
    });

    // Load initial data
    useEffect(() => {
        if (ready && user) {
            loadData();
        }
    }, [ready, user]);

    const loadData = async () => {
        try {
            setLoading(true);

            console.log("Starting to load data...");

            // Load materi
            const materiResponse = await materiApi.getAll().catch(err => {
                console.error("Materi API error:", err);
                return [];
            });

            // Load mata pelajaran
            console.log("Loading mata pelajaran...");
            const mapelResponse = await mataPelajaranApi.getAll({ limit: 1000 });
            console.log("Mata pelajaran response:", mapelResponse);

            // Load kelas
            console.log("Loading kelas...");
            const kelasResponse = await kelasApi.getAll({ limit: 1000 });
            console.log("Kelas response:", kelasResponse);

            // Load guru (for ADMIN)
            console.log("Loading guru...");
            const guruResponse = await guruApi.getAll({ limit: 1000 }).catch(err => {
                console.error("Guru API error:", err);
                return { data: [] };
            });
            console.log("Guru response:", guruResponse);

            // Extract data from paginated response
            const materiArray = Array.isArray(materiResponse) ? materiResponse : (materiResponse.data || []);
            const mapelArray = Array.isArray(mapelResponse) ? mapelResponse : (mapelResponse.data || []);
            const kelasArray = Array.isArray(kelasResponse) ? kelasResponse : (kelasResponse.data || []);
            const guruArray = Array.isArray(guruResponse) ? guruResponse : (guruResponse.data || []);

            console.log("Setting state:", {
                materi: materiArray.length,
                mapel: mapelArray.length,
                kelas: kelasArray.length,
                guru: guruArray.length,
            });

            setMateriList(materiArray);
            setMataPelajaranList(mapelArray);
            setKelasList(kelasArray);
            setGuruList(guruArray);

            console.log("Data loaded successfully!");
        } catch (error: any) {
            console.error("Error loading data:", error);
            console.error("Error details:", {
                message: error.message,
                status: error.status,
                data: error.data
            });
            alert("Gagal memuat data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter guru list when mata pelajaran or search changes
    useEffect(() => {
        const selectedMapelId = form.watch("mataPelajaranId");
        const searchQuery = guruSearch.toLowerCase();

        let filtered = guruList;

        // Filter by mata pelajaran if selected
        if (selectedMapelId) {
            filtered = filtered.filter((guru) =>
                guru.mataPelajaran?.some((mp: any) => mp.id === selectedMapelId)
            );
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter((guru) =>
                guru.user?.name?.toLowerCase().includes(searchQuery) ||
                guru.nip?.toLowerCase().includes(searchQuery)
            );
        }

        setFilteredGuruList(filtered);
    }, [form.watch("mataPelajaranId"), guruSearch, guruList]);

    const onSubmit = async (data: any) => {
        try {
            if (editingId) {
                await materiApi.update(editingId, data);
                alert("Materi berhasil diupdate!");
            } else {
                await materiApi.create(data);
                alert("Materi berhasil dibuat!");
            }
            setDialogOpen(false);
            form.reset();
            setEditingId(null);
            loadData();
        } catch (error: any) {
            console.error("Error saving materi:", error);
            alert("Gagal menyimpan materi: " + error.message);
        }
    };

    const handleEdit = (materi: any) => {
        setEditingId(materi.id);
        form.reset({
            judul: materi.judul,
            deskripsi: materi.deskripsi || "",
            tipe: materi.tipe,
            mataPelajaranId: materi.mataPelajaranId,
            kelasId: materi.kelasId || "",
            isPublished: materi.isPublished,
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus materi ini?")) return;

        try {
            await materiApi.delete(id);
            alert("Materi berhasil dihapus!");
            loadData();
        } catch (error: any) {
            console.error("Error deleting materi:", error);
            alert("Gagal menghapus materi: " + error.message);
        }
    };

    const handleNewMateri = () => {
        setEditingId(null);
        form.reset();
        setDialogOpen(true);
    };

    if (!ready) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Memuat data...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge tone="info" className="gap-2">
                                    <BookOpen size={14} />
                                    Kelola Materi
                                </Badge>
                                <Badge tone="success">{materiList.length} materi</Badge>
                            </div>
                            <CardTitle className="text-3xl">Manajemen Materi Pelajaran</CardTitle>
                            <CardDescription className="text-base">
                                Kelola dan upload materi pembelajaran untuk siswa
                            </CardDescription>
                        </div>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="gap-2" onClick={handleNewMateri}>
                                    <Plus size={18} />
                                    Upload Materi Baru
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>{editingId ? "Edit Materi" : "Upload Materi Baru"}</DialogTitle>
                                    <DialogDescription>
                                        Isi form di bawah ini untuk {editingId ? "mengupdate" : "menambahkan"} materi pembelajaran
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="judul"
                                            rules={{ required: "Judul harus diisi" }}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Judul Materi *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Contoh: Pengantar Pemrograman Python" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="deskripsi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Deskripsi</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Jelaskan isi materi secara singkat..."
                                                            className="min-h-[100px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="konten"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Konten Materi (URL atau Teks)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Isi link URL (YouTube, Google Drive, dll.) atau tulis konten teks materi"
                                                            className="min-h-[120px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Isi dengan URL link atau teks penjelasan materi
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* File Upload untuk HTML/documents */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Upload File Materi (HTML/PDF/DOCX)</label>
                                            <Input
                                                type="file"
                                                accept=".html,.pdf,.docx,.pptx"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        // TODO: Implement file upload to server
                                                        alert(`File ${file.name} siap diupload. Fitur upload sedang dalam pengembangan.`);
                                                    }
                                                }}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Upload file HTML, PDF, DOCX, atau PPTX sebagai konten materi (fitur coming soon)
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="tipe"
                                                rules={{ required: "Tipe materi harus dipilih" }}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Tipe Materi *</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Pilih tipe" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {TIPE_MATERI.map((tipe) => (
                                                                    <SelectItem key={tipe.value} value={tipe.value}>
                                                                        {tipe.icon} {tipe.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="mataPelajaranId"
                                                rules={{ required: "Mata pelajaran harus dipilih" }}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Mata Pelajaran *</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Pilih mata pelajaran" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {/* Search input */}
                                                                <div className="px-2 py-1.5 sticky top-0 bg-card z-10 border-b">
                                                                    <Input
                                                                        placeholder="Cari mata pelajaran..."
                                                                        value={mapelSearch}
                                                                        onChange={(e) => setMapelSearch(e.target.value)}
                                                                        className="h-8"
                                                                    />
                                                                </div>

                                                                {mataPelajaranList
                                                                    .filter((mapel) =>
                                                                        mapel.nama?.toLowerCase().includes(mapelSearch.toLowerCase()) ||
                                                                        mapel.kode?.toLowerCase().includes(mapelSearch.toLowerCase())
                                                                    )
                                                                    .map((mapel) => (
                                                                        <SelectItem key={mapel.id} value={mapel.id}>
                                                                            {mapel.nama}
                                                                        </SelectItem>
                                                                    ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Guru selection (ADMIN only) */}
                                        {role === "ADMIN" && (
                                            <FormField
                                                control={form.control}
                                                name="guruId"
                                                rules={{ required: "Guru pengampu harus dipilih" }}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Guru Pengampu *</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Pilih guru" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {/* Search input */}
                                                                <div className="px-2 py-1.5 sticky top-0 bg-card z-10 border-b">
                                                                    <Input
                                                                        placeholder="Cari guru..."
                                                                        value={guruSearch}
                                                                        onChange={(e) => setGuruSearch(e.target.value)}
                                                                        className="h-8"
                                                                    />
                                                                </div>

                                                                {filteredGuruList.length === 0 ? (
                                                                    <div className="px-8 py-6 text-center text-sm text-muted-foreground">
                                                                        {form.watch("mataPelajaranId")
                                                                            ? "Tidak ada guru untuk mata pelajaran ini"
                                                                            : "Pilih mata pelajaran terlebih dahulu"}
                                                                    </div>
                                                                ) : (
                                                                    filteredGuruList.map((guru) => (
                                                                        <SelectItem key={guru.id} value={guru.id}>
                                                                            <div className="flex flex-col gap-0.5">
                                                                                <span>{guru.user?.name || guru.nip}</span>
                                                                                <div className="flex gap-1 flex-wrap">
                                                                                    {guru.mataPelajaran?.map((mp: any) => (
                                                                                        <span key={mp.id} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                                                            {mp.kode}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription>
                                                            {form.watch("mataPelajaranId")
                                                                ? "Guru yang ditampilkan sesuai mata pelajaran yang dipilih"
                                                                : "Pilih mata pelajaran terlebih dahulu untuk melihat guru"}
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        <FormField
                                            control={form.control}
                                            name="kelasId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Kelas (Opsional)</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Semua kelas" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {kelasList.map((kelas) => (
                                                                <SelectItem key={kelas.id} value={kelas.id}>
                                                                    {kelas.nama}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        Kosongkan jika materi untuk semua kelas
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                                Batal
                                            </Button>
                                            <Button type="submit">
                                                {editingId ? "Update Materi" : "Simpan Materi"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
            </Card>

            {/* Materi List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {materiList.length === 0 ? (
                    <Card className="col-span-full">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-semibold mb-2">Belum ada materi</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Klik tombol "Upload Materi Baru" untuk menambahkan materi pertama Anda
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    materiList.map((materi) => {
                        const tipeInfo = TIPE_MATERI.find((t) => t.value === materi.tipe);
                        return (
                            <Card key={materi.id} className="group hover:shadow-lg transition-all">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{tipeInfo?.icon}</span>
                                            <Badge tone="info" className="text-xs">
                                                {tipeInfo?.label}
                                            </Badge>
                                        </div>
                                        {!materi.isPublished && (
                                            <Badge tone="warning" className="text-xs">Draft</Badge>
                                        )}
                                    </div>
                                    <CardTitle className="line-clamp-2">{materi.judul}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {materi.deskripsi || "Tidak ada deskripsi"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-sm space-y-1">
                                        <p className="text-muted-foreground">
                                            <strong>Mapel:</strong> {materi.mataPelajaran?.nama || "N/A"}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <strong>Kelas:</strong> {materi.kelas?.nama || "Semua kelas"}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <strong>Views:</strong> {materi.viewCount || 0} views
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 gap-2"
                                            onClick={() => handleEdit(materi)}
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-2"
                                            onClick={() => handleDelete(materi.id)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
