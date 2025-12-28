"use client";
import { API_URL } from "@/lib/api";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRole } from "../role-context";

// TODO: Create API client in lib/tahun-ajaran-api.ts
const tahunajaranApi = {
  getAll: async (params: any, token: string | null) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);

    const res = await fetch(`${API_URL}/tahun-ajaran?${searchParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
  create: async (data: any, token: string | null) => {
    const res = await fetch(`${API_URL}/tahun-ajaran`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  update: async (id: string, data: any, token: string | null) => {
    const res = await fetch(`${API_URL}/tahun-ajaran/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (id: string, token: string | null) => {
    const res = await fetch(`${API_URL}/tahun-ajaran/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
  setActive: async (id: string, token: string | null) => {
    const res = await fetch(`${API_URL}/tahun-ajaran/${id}/set-active`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};

export default function TahunAjaranPage() {
  const { token } = useRole();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["tahun-ajaran", page, search],
    queryFn: () => tahunajaranApi.getAll({ page, limit: 10, search: search || undefined }, token),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => tahunajaranApi.create(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tahun-ajaran"] });
      setIsCreateModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tahunajaranApi.update(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tahun-ajaran"] });
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tahunajaranApi.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tahun-ajaran"] });
      setDeletingItem(null);
    },
  });

  const setActiveMutation = useMutation({
    mutationFn: (id: string) => tahunajaranApi.setActive(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tahun-ajaran"] });
      queryClient.invalidateQueries({ queryKey: ["active-tahun-ajaran"] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tahun Ajaran</h1>
          <p className="text-muted-foreground">Kelola data tahun ajaran</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} />
          Tambah Tahun Ajaran
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Daftar Tahun Ajaran</CardTitle>
              <CardDescription>Total {data?.meta.total || 0} data</CardDescription>
            </div>
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Cari..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
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
                    <tr className="border-b border-border text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Tahun</th>
                      <th className="pb-3 font-medium">Tanggal Mulai</th>
                      <th className="pb-3 font-medium">Tanggal Selesai</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((item: any) => (
                      <tr key={item.id} className="border-b border-white/5 transition hover:bg-muted/40">
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {item.tahun}
                            {item.status === 'AKTIF' && (
                              <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                                Aktif
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-muted-foreground">{new Date(item.tanggalMulai).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                        <td className="py-4 text-muted-foreground">{new Date(item.tanggalSelesai).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                        <td className="py-4">{item.status}</td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {item.status !== 'AKTIF' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveMutation.mutate(item.id)}
                                disabled={setActiveMutation.isPending}
                              >
                                Set Aktif
                              </Button>
                            )}
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
          title="Tambah Tahun Ajaran"
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data: any) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      )}

      {editingItem && (
        <FormModal
          title="Edit Tahun Ajaran"
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
  const [formData, setFormData] = useState(() => {
    if (!item) return {};
    return {
      ...item,
      tanggalMulai: item.tanggalMulai ? new Date(item.tanggalMulai).toISOString().split('T')[0] : '',
      tanggalSelesai: item.tanggalSelesai ? new Date(item.tanggalSelesai).toISOString().split('T')[0] : '',
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove system fields before submitting
    const { id, createdAt, updatedAt, deletedAt, _count, kelas, ...cleanData } = formData;

    console.log('Submitting Tahun Ajaran data:', cleanData);
    onSubmit(cleanData);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Tahun</label>
            <input
              type="text"
              required
              placeholder="2024/2025"


              value={formData.tahun || ''}
              onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Tanggal Mulai</label>
            <input
              type="date"
              required



              value={formData.tanggalMulai || ''}
              onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Tanggal Selesai</label>
            <input
              type="date"
              required



              value={formData.tanggalSelesai || ''}
              onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Status</label>
            <select
              required
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Pilih Status</option>
              <option value="AKTIF">AKTIF</option>
              <option value="SELESAI">SELESAI</option>
              <option value="AKAN_DATANG">AKAN_DATANG</option>
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
      </DialogContent>
    </Dialog>
  );
}

function DeleteModal({ item, onClose, onConfirm, isLoading }: any) {
  return (
    <AlertDialog open={true} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Tahun Ajaran</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Batal</AlertDialogCancel>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Hapus"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
