"use client";
import { API_URL } from "@/lib/api";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Loader2, X, Upload, Download } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

// TODO: Create API client in lib/mata-pelajaran-api.ts
const matapelajaranApi = {
  getAll: async (params: any, token: string | null) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);

    const res = await fetch(`${API_URL}/mata-pelajaran?${searchParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
  create: async (data: any, token: string | null) => {
    const res = await fetch(`${API_URL}/mata-pelajaran`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  update: async (id: string, data: any, token: string | null) => {
    const res = await fetch(`${API_URL}/mata-pelajaran/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (id: string, token: string | null) => {
    const res = await fetch(`${API_URL}/mata-pelajaran/${id}`, {
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
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
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
        <div className="flex gap-2">
          <Button onClick={() => setIsImportModalOpen(true)} variant="outline">
            <Upload size={16} />
            Import Excel
          </Button>
          <Button
            onClick={async () => {
              const res = await fetch('http://localhost:3001/mata-pelajaran/export', {
                headers: { Authorization: `Bearer ${token}` },
              });
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'data_mata_pelajaran.xlsx';
              a.click();
            }}
            variant="outline"
          >
            <Download size={16} />
            Export
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={16} />
            Tambah Mata Pelajaran
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Daftar Mata Pelajaran</CardTitle>
              <CardDescription>Total {data?.meta?.total || data?.length || 0} data</CardDescription>
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
                      <th className="pb-3 font-medium">Kode</th>
                      <th className="pb-3 font-medium">Nama</th>
                      <th className="pb-3 font-medium">Tingkat</th>
                      <th className="pb-3 font-medium">Jam/Minggu</th>
                      <th className="pb-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(data) ? data : data?.data || []).map((item: any) => (
                      <tr key={item.id} className="border-b border-white/5 transition hover:bg-muted/40">
                        <td className="py-4">
                          <span className="font-mono text-sm text-muted-foreground">{item.kode}</span>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{item.nama}</p>
                            {item.deskripsi && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{item.deskripsi}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            {item.tingkat}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="text-sm">{item.jamPelajaran} jam</span>
                        </td>
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

              {data?.meta && data.meta.totalPages > 1 && (
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

      {isImportModalOpen && (
        <ImportModal
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["mata-pelajaran"] });
            setIsImportModalOpen(false);
          }}
          token={token}
        />
      )}
    </div>
  );
}

function ImportModal({ onClose, onSuccess, token }: { onClose: () => void; onSuccess: () => void; token: string | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3001/mata-pelajaran/import', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Import failed');

      const data = await res.json();
      setResult(data);

      if (data.success > 0) {
        toast({ title: "Berhasil!", description: `${data.success} data berhasil diimport` });
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || 'Gagal import data', variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Excel - Mata Pelajaran</DialogTitle>
          <DialogDescription>
            Upload file Excel dengan kolom: Kode, Nama, Jam Pelajaran, Tingkat, Deskripsi
          </DialogDescription>
        </DialogHeader>
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Button
                type="button"
                onClick={async () => {
                  const res = await fetch('http://localhost:3001/mata-pelajaran/template', {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const blob = await res.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'template_import_mata_pelajaran.xlsx';
                  a.click();
                }}
                variant="outline"
                className="w-full"
              >
                <Download size={16} />
                Download Template
              </Button>
            </div>
            <div>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Batal
              </Button>
              <Button type="submit" disabled={!file || isLoading} className="flex-1">
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Upload"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <p className="text-sm"><strong>Berhasil:</strong> {result.success}</p>
            <p className="text-sm"><strong>Gagal:</strong> {result.failed}</p>
            <p className="text-sm"><strong>Dilewati:</strong> {result.skipped}</p>
            {result.errors?.length > 0 && (
              <div className="mt-4 max-h-48 overflow-y-auto">
                <p className="text-sm font-medium mb-2">Errors:</p>
                {result.errors.slice(0, 5).map((err: any, i: number) => (
                  <p key={i} className="text-xs text-red-500">Row {err.row}: {err.error}</p>
                ))}
              </div>
            )}
            <Button onClick={onClose} className="w-full mt-4">Tutup</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FormModal({ title, item, onClose, onSubmit, isLoading }: any) {
  const [formData, setFormData] = useState(item || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Kode</label>
            <input
              type="text"
              required
              placeholder="MAT101"


              value={formData.kode || ''}
              onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Nama Mata Pelajaran</label>
            <input
              type="text"
              required



              value={formData.nama || ''}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Jam Pelajaran/Minggu</label>
            <input
              type="number"
              required



              value={formData.jamPelajaran || ''}
              onChange={(e) => setFormData({ ...formData, jamPelajaran: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Deskripsi</label>
            <textarea

              value={formData.deskripsi || ''}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Tingkat</label>
            <select
              required
              value={formData.tingkat || ''}
              onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
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
      </DialogContent>
    </Dialog>
  );
}

function DeleteModal({ item, onClose, onConfirm, isLoading }: any) {
  return (
    <AlertDialog open={true} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Mata Pelajaran</AlertDialogTitle>
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
