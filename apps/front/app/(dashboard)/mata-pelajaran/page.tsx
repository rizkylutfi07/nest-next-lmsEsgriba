"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "../role-context";

// TODO: Create API client in lib/mata-pelajaran-api.ts
const matapelajaranApi = {
  getAll: async (params: any, token: string | null) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    
    const res = await fetch(`http://localhost:3001/mata-pelajaran?${searchParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
  create: async (data: any, token: string | null) => {
    const res = await fetch(`http://localhost:3001/mata-pelajaran`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  update: async (id: string, data: any, token: string | null) => {
    const res = await fetch(`http://localhost:3001/mata-pelajaran/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (id: string, token: string | null) => {
    const res = await fetch(`http://localhost:3001/mata-pelajaran/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};

export default function MataPelajaranPage() {
  const { token } = useRole();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["mata-pelajaran", page, search],
    queryFn: () => matapelajaranApi.getAll({ page, limit: 10, search: search || undefined }, token),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => matapelajaranApi.create(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-pelajaran"] });
      setIsCreateModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => matapelajaranApi.update(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-pelajaran"] });
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => matapelajaranApi.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-pelajaran"] });
      setDeletingItem(null);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mata Pelajaran</h1>
          <p className="text-muted-foreground">Kelola data mata pelajaran</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} />
          Tambah Mata Pelajaran
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Daftar Mata Pelajaran</CardTitle>
              <CardDescription>Total {data?.meta.total || 0} data</CardDescription>
            </div>
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Cari..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-primary/60 focus:bg-white/10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Kode</th>
                      <th className="pb-3 font-medium">Nama Mata Pelajaran</th>
                      <th className="pb-3 font-medium">Jam Pelajaran/Minggu</th>
                      <th className="pb-3 font-medium">Tingkat</th>
                      <th className="pb-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((item: any) => (
                      <tr key={item.id} className="border-b border-white/5 transition hover:bg-white/5">
                        <td className="py-4">{item.kode}</td>
                        <td className="py-4">{item.nama}</td>
                        <td className="py-4">{item.jamPelajaran}</td>
                        <td className="py-4">{item.tingkat}</td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)}>
                              <Pencil size={14} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeletingItem(item)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data && data.meta.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Halaman {data.meta.page} dari {data.meta.totalPages}
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
          title="Tambah Mata Pelajaran"
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      )}

      {editingItem && (
        <FormModal
          title="Edit Mata Pelajaran"
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
    </div>
  );
}

function FormModal({ title, item, onClose, onSubmit, isLoading }: any) {
  const [formData, setFormData] = useState(item || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
              <label className="mb-2 block text-sm font-medium">Kode</label>
              <input
                type="text"
                required
                placeholder="MAT101"
                
                
                value={formData.kode || ''}
                onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Nama Mata Pelajaran</label>
              <input
                type="text"
                required
                
                
                
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Jam Pelajaran/Minggu</label>
              <input
                type="number"
                required
                
                
                
                value={formData.jamPelajaran || ''}
                onChange={(e) => setFormData({ ...formData, jamPelajaran: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Deskripsi</label>
              <textarea
                
                value={formData.deskripsi || ''}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                rows={3}
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
                <option value="SEMUA">SEMUA</option>
              </select>
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
          <CardTitle>Hapus Mata Pelajaran</CardTitle>
          <CardDescription>
            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={isLoading} className="flex-1">
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Hapus"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
