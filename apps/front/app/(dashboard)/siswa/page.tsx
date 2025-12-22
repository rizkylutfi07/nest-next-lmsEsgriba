"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Trash2, Plus, Upload, Download, X, ArrowUp, ArrowDown, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRole } from "../role-context";
import { useToast } from "@/hooks/use-toast";

export default function SiswaPage() {
  const { token } = useRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTahunAjaran, setFilterTahunAjaran] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["siswa", page, search, filterKelas, filterStatus, sortBy, sortOrder, filterTahunAjaran],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy,
        sortOrder,
      });
      if (search) params.append('search', search);
      if (filterKelas) params.append('kelasId', filterKelas);
      if (filterStatus) params.append('status', filterStatus);
      if (filterTahunAjaran) params.append('tahunAjaranId', filterTahunAjaran);

      const res = await fetch(
        `http://localhost:3001/siswa?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.json();
    },
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Fetch kelas list
  const { data: kelasList } = useQuery({
    queryKey: ["kelas-list"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/kelas?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
  });

  // Fetch active Tahun Ajaran for filter
  const { data: activeTahunAjaran } = useQuery({
    queryKey: ["active-tahun-ajaran"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/tahun-ajaran/active/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("http://localhost:3001/siswa", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siswa"] });
      setIsCreateModalOpen(false);
      toast({ title: "Berhasil!", description: "Data siswa berhasil ditambahkan" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: any) => {
      const res = await fetch(`http://localhost:3001/siswa/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to update' }));
        throw new Error(errorData.message || `HTTP ${res.status}: Failed to update`);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siswa"] });
      setEditingItem(null);
      toast({ title: "Berhasil!", description: "Data siswa berhasil diupdate" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`http://localhost:3001/siswa/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siswa"] });
      setDeletingItem(null);
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="md:flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Data Siswa</h1>
              <p className="text-sm text-muted-foreground">Kelola data siswa</p>
            </div>

            <div className="flex gap-2 mt-4 md:mt-0">
              <Button onClick={() => setIsImportModalOpen(true)} variant="outline">
                <Upload size={16} />
                Import Excel
              </Button>
              <Button
                onClick={async () => {
                  const res = await fetch('http://localhost:3001/siswa/export', {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const blob = await res.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'data_siswa.xlsx';
                  a.click();
                }}
                variant="outline"
              >
                <Download size={16} />
                Export
              </Button>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus size={16} />
                Tambah Siswa
              </Button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterKelas}
              onChange={(e) => { setFilterKelas(e.target.value); setPage(1); }}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Semua Kelas</option>
              {kelasList?.data?.map((kelas: any) => (
                <option key={kelas.id} value={kelas.id}>
                  {kelas.nama}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Semua Status</option>
              <option value="AKTIF">AKTIF</option>
              <option value="PKL">PKL</option>
              <option value="PINDAH">PINDAH</option>
              <option value="ALUMNI">ALUMNI</option>
            </select>
            <select
              value={filterTahunAjaran}
              onChange={(e) => { setFilterTahunAjaran(e.target.value); setPage(1); }}
              className="hidden md:block rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Semua Tahun Ajaran</option>
              {activeTahunAjaran && (
                <option value={activeTahunAjaran.id}>
                  {activeTahunAjaran.tahun} (Aktif)
                </option>
              )}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-2 md:p-4">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm p-4">
              <thead className="bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort('nisn')}
                    >
                      NISN
                      {sortBy === 'nisn' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort('nama')}
                    >
                      Nama
                      {sortBy === 'nama' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort('kelas')}
                    >
                      Kelas
                      {sortBy === 'kelas' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">Tahun Pelajaran</th>
                  <th className="px-6 py-3 text-left">
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {sortBy === 'status' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="px-6 py-4">
                        <div className="h-4 animate-pulse rounded bg-muted/50" />
                      </td>
                    </tr>
                  ))
                ) : data?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  data?.data?.map((item: any) => (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-4 font-medium">{item.nisn}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{item.nama}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{item.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="bg-background">
                          {item.kelas?.nama ?? "-"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {item.tahunAjaran ? (
                          <div className="text-sm">
                            <div className="font-medium">{item.tahunAjaran.tahun}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={cn(
                            "capitalize",
                            item.status === "AKTIF" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20",
                            item.status === "PKL" && "bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 border-blue-500/20",
                            item.status === "PINDAH" && "bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 border-amber-500/20",
                            item.status === "ALUMNI" && "bg-slate-500/15 text-slate-600 dark:text-slate-400 hover:bg-slate-500/25 border-slate-500/20"
                          )}
                        >
                          {item.status?.toLowerCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingItem(item)}
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingItem(item)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && data?.meta && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Menampilkan <strong>{(page - 1) * 10 + 1}</strong> sampai{" "}
                <strong>{Math.min(page * 10, data.meta.total)}</strong> dari{" "}
                <strong>{data.meta.total}</strong> hasil
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft size={16} />
                </Button>
                {Array.from({ length: Math.min(5, data.meta.totalPages) }, (_, i) => {
                  let p = i + 1;
                  if (data.meta.totalPages > 5 && page > 3) {
                    p = page - 2 + i;
                    if (p > data.meta.totalPages) p = data.meta.totalPages - 4 + i;
                  }

                  // Ensure p is valid
                  if (p < 1) p = 1;
                  if (p > data.meta.totalPages) return null;

                  return (
                    <Button
                      key={p}
                      variant={page === p ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(p)}
                      className="h-8 w-8 p-0"
                    >
                      {p}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                  disabled={page === data.meta.totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isCreateModalOpen && (
        <FormModal
          title="Tambah Siswa"
          item={null}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      )}

      {editingItem && (
        <FormModal
          title="Edit Siswa"
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={(data) => updateMutation.mutate({ id: editingItem.id, data })}
          isLoading={updateMutation.isPending}
        />
      )}

      {deletingItem && (
        <DeleteModal
          item={deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={() => deleteMutation.mutate(deletingItem.id)}
          isLoading={deleteMutation.isPending}
        />
      )}

      {isImportModalOpen && (
        <ImportModal
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["siswa"] });
            setIsImportModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function FormModal({ title, item, onClose, onSubmit, isLoading }: any) {
  const { token } = useRole();
  const [formData, setFormData] = useState(item || {});

  // Fetch kelas list
  const { data: kelasList } = useQuery({
    queryKey: ["kelas-list"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/kelas?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { id, createdAt, updatedAt, deletedAt, kelas, tahunAjaran, user, userId, ...cleanData } = formData;

    // Remove null/empty values but keep createUserAccount if it's true
    Object.keys(cleanData).forEach(key => {
      if (key === 'createUserAccount') return; // Keep this field
      if (cleanData[key] === null || cleanData[key] === '' || cleanData[key] === undefined) {
        delete cleanData[key];
      }
    });

    console.log('Submitting siswa data:', cleanData);
    onSubmit(cleanData);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">NISN</label>
              <input
                type="text"
                required
                value={formData.nisn || ''}
                onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Nama Lengkap</label>
              <input
                type="text"
                required
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Tanggal Lahir</label>
              <input
                type="date"
                required
                value={formData.tanggalLahir?.split('T')[0] || ''}
                onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Alamat</label>
              <textarea
                value={formData.alamat || ''}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                rows={2}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Nomor Telepon</label>
              <input
                type="tel"
                value={formData.nomorTelepon || ''}
                onChange={(e) => setFormData({ ...formData, nomorTelepon: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Kelas</label>
              <select
                value={formData.kelasId || ''}
                onChange={(e) => setFormData({ ...formData, kelasId: e.target.value || undefined })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Pilih Kelas</option>
                {kelasList?.data?.map((kelas: any) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <select
                required
                value={formData.status || 'AKTIF'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              >
                <option value="AKTIF">AKTIF</option>
                <option value="PKL">PKL</option>
                <option value="PINDAH">PINDAH</option>
                <option value="ALUMNI">ALUMNI</option>
              </select>
            </div>

            {!item && (
              <div className="rounded-lg border border-border bg-background p-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.createUserAccount || false}
                    onChange={(e) => setFormData({ ...formData, createUserAccount: e.target.checked })}
                    className="rounded border-white/20"
                  />
                  <span className="text-sm font-medium">Buat akun user untuk login</span>
                </label>
                {formData.createUserAccount && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Password default: NISN siswa (dapat diubah nanti)
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ImportModal({ onClose, onSuccess }: any) {
  const { token } = useRole();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3001/siswa/import', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setResult(data);

      if (data.success > 0) {
        toast({ title: "Berhasil!", description: `${data.success} data berhasil diimport` });
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = async () => {
    const res = await fetch('http://localhost:3001/siswa/template', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_import_siswa.xlsx';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Import Data Siswa dari Excel</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button onClick={downloadTemplate} variant="outline" className="w-full">
              <Download size={16} />
              Download Template Excel
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Download template, isi data siswa, lalu upload kembali
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <label className="mb-2 block text-sm font-medium">Pilih File Excel/CSV</label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
            {file && (
              <p className="mt-2 text-xs text-muted-foreground">
                File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {result && (
            <div className="rounded-lg border border-border bg-background p-4">
              <h4 className="font-medium mb-2">Hasil Import:</h4>
              <p className="text-sm text-green-500">✓ Berhasil: {result.success}</p>
              <p className="text-sm text-red-500">✗ Gagal: {result.failed}</p>
              {result.errors?.length > 0 && (
                <div className="mt-2 max-h-32 overflow-y-auto">
                  <p className="text-xs font-medium">Errors:</p>
                  {result.errors.map((err: any, idx: number) => (
                    <p key={idx} className="text-xs text-red-400">
                      Row {err.row}: {err.error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Tutup
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="flex-1"
            >
              {isUploading ? <Loader2 className="animate-spin" size={16} /> : "Upload & Import"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DeleteModal({ item, onClose, onConfirm, isLoading }: any) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Konfirmasi Hapus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Apakah Anda yakin ingin menghapus siswa <strong>{item.nama}</strong>?</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button onClick={onConfirm} disabled={isLoading} className="flex-1">
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Hapus"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
