"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "../role-context";

const jurusanApi = {
  getAll: async (params: any, token: string | null) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);

    const res = await fetch(`http://localhost:3001/jurusan?${searchParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
  create: async (data: any, token: string | null) => {
    const res = await fetch(`http://localhost:3001/jurusan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  update: async (id: string, data: any, token: string | null) => {
    const res = await fetch(`http://localhost:3001/jurusan/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (id: string, token: string | null) => {
    const res = await fetch(`http://localhost:3001/jurusan/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};

export default function JurusanPage() {
  const { token } = useRole();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["jurusan", page, search],
    queryFn: () => jurusanApi.getAll({ page, limit: 10, search: search || undefined }, token),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => jurusanApi.create(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jurusan"] });
      setIsCreateModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => jurusanApi.update(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jurusan"] });
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => jurusanApi.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jurusan"] });
      setDeletingItem(null);
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="md:flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Data Jurusan</h1>
              <p className="text-sm text-muted-foreground">Kelola data jurusan/program studi</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 md:mt-0">
              <Plus size={16} />
              Tambah Jurusan
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Daftar Jurusan</CardTitle>
              <CardDescription>Total {data?.meta.total || 0} jurusan</CardDescription>
            </div>
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Cari kode atau nama..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none transition focus:border-primary/60"
              />
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
                      <th className="px-6 py-3 text-left">Kode</th>
                      <th className="px-6 py-3 text-left">Nama Jurusan</th>
                      <th className="px-6 py-3 text-left">Deskripsi</th>
                      <th className="px-6 py-3 text-left">Jumlah Kelas</th>
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
                          <td className="px-6 py-4 font-mono text-sm">{item.kode}</td>
                          <td className="px-6 py-4 font-medium">{item.nama}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{item.deskripsi || '-'}</td>
                          <td className="px-6 py-4 text-sm">{item._count?.kelas || 0} kelas</td>
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

              {data && data.meta.totalPages > 1 && (
                <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-border py-4 sm:flex-row">
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
          title="Tambah Jurusan"
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data: any) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      )}

      {editingItem && (
        <FormModal
          title="Edit Jurusan"
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={(data: any) => updateMutation.mutate({ id: editingItem.id, data })}
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
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
              <label className="mb-2 block text-sm font-medium">Kode Jurusan</label>
              <input
                type="text"
                required
                placeholder="IPA, IPS, RPL, dll"
                value={formData.kode || ''}
                onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Nama Jurusan</label>
              <input
                type="text"
                required
                placeholder="Ilmu Pengetahuan Alam"
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Deskripsi (Opsional)</label>
              <textarea
                value={formData.deskripsi || ''}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Hapus Jurusan</CardTitle>
          <CardDescription>
            Apakah Anda yakin ingin menghapus jurusan <strong>{item.nama}</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button variant="outline" onClick={onConfirm} disabled={isLoading} className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500/20">
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Hapus"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
