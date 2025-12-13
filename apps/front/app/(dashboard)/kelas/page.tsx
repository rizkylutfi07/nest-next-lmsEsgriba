"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "../role-context";

// TODO: Create API client in lib/kelas-api.ts
const kelasApi = {
  getAll: async (params: any, token: string | null) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);

    const res = await fetch(`http://localhost:3001/kelas?${searchParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
  create: async (data: any, token: string | null) => {
    const res = await fetch(`http://localhost:3001/kelas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create kelas');
    }
    return res.json();
  },
  update: async (id: string, data: any, token: string | null) => {
    const res = await fetch(`http://localhost:3001/kelas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      let errorMessage = 'Failed to update kelas';
      try {
        const error = await res.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Response is not JSON, use status text
        errorMessage = res.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    return res.json();
  },
  delete: async (id: string, token: string | null) => {
    const res = await fetch(`http://localhost:3001/kelas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};

export default function KelasPage() {
  const { token } = useRole();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterTahunAjaran, setFilterTahunAjaran] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingKelas, setEditingKelas] = useState<any>(null);
  const [deletingKelas, setDeletingKelas] = useState<any>(null);

  // Fetch active Tahun Ajaran
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

  const { data, isLoading } = useQuery({
    queryKey: ["kelas", page, search, filterTahunAjaran],
    queryFn: () => kelasApi.getAll({ page, limit: 10, search, tahunAjaranId: filterTahunAjaran }, token),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => kelasApi.create(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      alert(error.message || 'Gagal menambah data kelas');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => kelasApi.update(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      setEditingKelas(null);
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      alert(error.message || 'Gagal mengupdate data kelas');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => kelasApi.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      setDeletingKelas(null);
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="md:flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Data Kelas</h1>
              <p className="text-sm text-muted-foreground">Kelola data data kelas</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 md:mt-0">
              <Plus size={16} />
              Tambah Kelas
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="min-w-[200px]">
              <CardTitle>Daftar Data Kelas</CardTitle>
              <CardDescription>Total {data?.meta.total || 0} data</CardDescription>
            </div>
            <div className="flex flex-1 flex-col gap-2 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none transition focus:border-primary/60"
                />
              </div>
              <select
                value={filterTahunAjaran}
                onChange={(e) => { setFilterTahunAjaran(e.target.value); setPage(1); }}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary/60 md:w-64"
              >
                <option value="">Semua Tahun Ajaran</option>
                {data?.data?.[0]?.tahunAjaran && (
                  <option value={activeTahunAjaran?.id}>
                    {activeTahunAjaran?.tahun} Semester {activeTahunAjaran?.semester} (Aktif)
                  </option>
                )}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 md:p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm p-4">
                  <thead className="bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3 text-left">Nama Kelas</th>
                      <th className="px-6 py-3 text-left">Tingkat</th>
                      <th className="px-6 py-3 text-left">Jurusan</th>
                      <th className="px-6 py-3 text-left">Wali Kelas</th>
                      <th className="px-6 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data?.data.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                          Data tidak ditemukan
                        </td>
                      </tr>
                    ) : (
                      data?.data.map((item: any) => (
                        <tr key={item.id} className="group transition-colors hover:bg-muted/30">
                          <td className="px-6 py-4 font-medium">{item.nama}</td>
                          <td className="px-6 py-4">{item.tingkat}</td>
                          <td className="px-6 py-4">{item.jurusan?.nama || '-'}</td>
                          <td className="px-6 py-4">{item.waliKelas?.nama || '-'}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingKelas(item)}
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeletingKelas(item)}
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

              {data && data.meta.totalPages > 1 && (
                <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-border py-4 sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    Menampilkan <strong>{(page - 1) * 10 + 1}</strong> sampai{" "}
                    <strong>{Math.min(page * 10, data.meta.total)}</strong> dari{" "}
                    <strong>{data.meta.total}</strong> hasil
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                      Sebelumnya
                    </Button>
                    <Button variant="outline" size="sm" disabled={page === data.meta.totalPages} onClick={() => setPage(page + 1)}>
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {isCreateModalOpen && (
        <FormModal
          title="Tambah Kelas"
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      )}

      {editingKelas && (
        <FormModal
          title="Edit Kelas"
          item={editingKelas}
          onClose={() => setEditingKelas(null)}
          onSubmit={(data) => updateMutation.mutate({ id: editingKelas.id, data })}
          isLoading={updateMutation.isPending}
        />
      )}

      {deletingKelas && (
        <DeleteModal
          item={deletingKelas}
          onClose={() => setDeletingKelas(null)}
          onConfirm={() => deleteMutation.mutate(deletingKelas.id)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}

function FormModal({ title, item, onClose, onSubmit, isLoading }: any) {
  const { token } = useRole();
  const [formData, setFormData] = useState(item || {});

  // Fetch jurusan list
  const { data: jurusanList } = useQuery({
    queryKey: ["jurusan-list"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/jurusan?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
  });

  // Fetch guru list for wali kelas
  const { data: guruList } = useQuery({
    queryKey: ["guru-list"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/guru?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
  });

  // Fetch active Tahun Ajaran for auto-fill
  const { data: activeTahunAjaran } = useQuery({
    queryKey: ["active-tahun-ajaran-form"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/tahun-ajaran/active/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      return res.json();
    },
  });

  // Auto-fill tahunAjaranId for new Kelas
  if (!item && activeTahunAjaran && !formData.tahunAjaranId) {
    setFormData({ ...formData, tahunAjaranId: activeTahunAjaran.id });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove system fields and _count before submitting, but KEEP tahunAjaranId
    const { id, createdAt, updatedAt, deletedAt, _count, waliKelas, jurusan, siswa, tahunAjaran, ...cleanData } = formData;

    // Remove null/undefined values
    const finalData = Object.fromEntries(
      Object.entries(cleanData).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );

    console.log('Submitting cleaned data:', finalData);
    console.log('Original formData:', formData);
    onSubmit(finalData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md">
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
              <label className="mb-2 block text-sm font-medium">Nama Kelas</label>
              <input
                type="text"
                required
                placeholder="X IPA 1"
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Tingkat</label>
              <select
                required
                value={formData.tingkat || ''}
                onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              >
                <option value="">Pilih Tingkat</option>
                <option value="X">X</option>
                <option value="XI">XI</option>
                <option value="XII">XII</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Jurusan</label>
              <select
                value={formData.jurusanId || ''}
                onChange={(e) => setFormData({ ...formData, jurusanId: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              >
                <option value="">Pilih Jurusan (Opsional)</option>
                {jurusanList?.data?.map((jurusan: any) => (
                  <option key={jurusan.id} value={jurusan.id}>
                    {jurusan.kode} - {jurusan.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Wali Kelas</label>
              <select
                value={formData.waliKelasId || ''}
                onChange={(e) => setFormData({ ...formData, waliKelasId: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              >
                <option value="">Pilih Wali Kelas (Opsional)</option>
                {guruList?.data?.map((guru: any) => (
                  <option key={guru.id} value={guru.id}>
                    {guru.nama} - {guru.nip}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Kapasitas</label>
              <input
                type="number"
                required
                min="1"
                value={formData.kapasitas || ''}
                onChange={(e) => setFormData({ ...formData, kapasitas: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              />
            </div>
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

function DeleteModal({ item, onClose, onConfirm, isLoading }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Hapus Kelas</CardTitle>
          <CardDescription>
            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button onClick={onConfirm} disabled={isLoading} className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Hapus"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
