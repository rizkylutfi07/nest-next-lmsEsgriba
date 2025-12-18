"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Loader2, X, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "../role-context";

// TODO: Create API client in lib/guru-api.ts
const guruApi = {
  getAll: async (params: any, token: string | null) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);

    const res = await fetch(`http://localhost:3001/guru?${searchParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
  create: async (data: any, token: string | null) => {
    const res = await fetch(`http://localhost:3001/guru`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create guru');
    }
    return res.json();
  },
  update: async (id: string, data: any, token: string | null) => {
    const res = await fetch(`http://localhost:3001/guru/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update guru');
    }
    return res.json();
  },
  delete: async (id: string, token: string | null) => {
    const res = await fetch(`http://localhost:3001/guru/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};

function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function GuruPage() {
  const { token } = useRole();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["guru", page, search],
    queryFn: () => guruApi.getAll({ page, limit: 10, search: search || undefined }, token),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => guruApi.create(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guru"] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      alert(error.message || 'Gagal menambah data guru');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => guruApi.update(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guru"] });
      setEditingItem(null);
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      alert(error.message || 'Gagal mengupdate data guru');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => guruApi.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guru"] });
      setDeletingItem(null);
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="md:flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Data Guru</h1>
              <p className="text-sm text-muted-foreground">Kelola data data guru</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button onClick={() => setIsImportModalOpen(true)} variant="outline">
                <Upload size={16} />
                Import Excel
              </Button>
              <Button
                onClick={async () => {
                  const res = await fetch('http://localhost:3001/guru/export', {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const blob = await res.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'data_guru.xlsx';
                  a.click();
                }}
                variant="outline"
              >
                <Download size={16} />
                Export
              </Button>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus size={16} />
                Tambah Guru
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Daftar Data Guru</CardTitle>
              <CardDescription>Total {data?.meta.total || 0} data</CardDescription>
            </div>
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Cari..."
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
                      <th className="px-6 py-3 text-left">NIP</th>
                      <th className="px-6 py-3 text-left">Nama Lengkap</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Mata Pelajaran</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data?.data.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                          Data tidak ditemukan
                        </td>
                      </tr>
                    ) : (
                      data?.data.map((item: any) => (
                        <tr key={item.id} className="group transition-colors hover:bg-muted/30">
                          <td className="px-6 py-4 font-medium">{item.nip}</td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-foreground">{item.nama}</div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{item.email}</td>
                          <td className="px-6 py-4">
                            {item.mataPelajaran?.length > 0
                              ? item.mataPelajaran.map((mp: any) => mp.nama).join(', ')
                              : '-'}
                          </td>
                          <td className="px-6 py-4">{item.status}</td>
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
          title="Tambah Guru"
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data: any) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      )}

      {editingItem && (
        <FormModal
          title="Edit Guru"
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

      {isImportModalOpen && (
        <ImportModal
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["guru"] });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3001/guru/import', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Import failed');

      const data = await res.json();
      setResult(data);

      if (data.success > 0) {
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (error: any) {
      alert(error.message || 'Gagal import data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[99999] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />
          <Card className="relative z-50 w-full max-w-md transform overflow-hidden shadow-xl text-left">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Import Excel - Guru</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X size={18} />
                </Button>
              </div>
              <CardDescription>
                Upload file Excel dengan kolom: NIP, Nama Lengkap, Email, Nomor Telepon, Status, Buat Akun (Ya/Tidak)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Button
                      type="button"
                      onClick={async () => {
                        const res = await fetch('http://localhost:3001/guru/template', {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        const blob = await res.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'template_import_guru.xlsx';
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
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </ModalPortal >
  );
}

function FormModal({ title, item, onClose, onSubmit, isLoading }: any) {
  const { token } = useRole();
  const [searchMataPelajaran, setSearchMataPelajaran] = useState("");
  const [formData, setFormData] = useState(() => {
    // Initialize mataPelajaranIds from item.mataPelajaran array
    const initialData = item || {};
    if (item?.mataPelajaran) {
      initialData.mataPelajaranIds = item.mataPelajaran.map((mp: any) => mp.id);
    }
    return initialData;
  });

  // Fetch mata pelajaran list
  const { data: mataPelajaranList } = useQuery({
    queryKey: ["mata-pelajaran-list"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/mata-pelajaran?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Hanya kirim field yang diizinkan oleh DTO backend (Create/UpdateGuruDto)
    const cleanData = {
      nip: formData.nip,
      nama: formData.nama,
      email: formData.email,
      nomorTelepon: formData.nomorTelepon,
      status: formData.status,
      mataPelajaranIds: formData.mataPelajaranIds,
    };

    console.log('Submitting guru data:', cleanData);
    onSubmit(cleanData);
  };

  const toggleMataPelajaran = (mpId: string) => {
    const current = formData.mataPelajaranIds || [];
    const newIds = current.includes(mpId)
      ? current.filter((id: string) => id !== mpId)
      : [...current, mpId];
    setFormData({ ...formData, mataPelajaranIds: newIds });
  };

  // Filter and sort mata pelajaran
  const filteredAndSortedMataPelajaran = mataPelajaranList?.data
    ? [...mataPelajaranList.data]
      .filter((mp: any) => {
        if (!searchMataPelajaran) return true;
        const searchLower = searchMataPelajaran.toLowerCase();
        return (
          mp.nama.toLowerCase().includes(searchLower) ||
          mp.kode.toLowerCase().includes(searchLower)
        );
      })
      .sort((a: any, b: any) => {
        // Sort by nama A-Z
        return a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' });
      })
    : [];

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[99999] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />
          <Card className="relative z-50 w-full max-w-md transform overflow-hidden shadow-xl text-left">
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
                  <label className="mb-2 block text-sm font-medium">NIP</label>
                  <input
                    type="text"
                    required



                    value={formData.nip || ''}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Nama Lengkap</label>
                  <input
                    type="text"
                    required



                    value={formData.nama || ''}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    required



                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Nomor Telepon</label>
                  <input
                    type="tel"




                    value={formData.nomorTelepon || ''}
                    onChange={(e) => setFormData({ ...formData, nomorTelepon: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Status</label>
                  <select
                    required
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
                  >
                    <option value="">Pilih Status</option>
                    <option value="AKTIF">AKTIF</option>
                    <option value="CUTI">CUTI</option>
                    <option value="PENSIUN">PENSIUN</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Mata Pelajaran</label>

                  {/* Search Input */}
                  <div className="mb-2 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Cari mata pelajaran..."
                      value={searchMataPelajaran}
                      onChange={(e) => setSearchMataPelajaran(e.target.value)}
                      className="w-full h-9 rounded-md border border-white/10 bg-white/5 pl-9 pr-4 text-sm outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-3">
                    {mataPelajaranList?.data?.length > 0 ? (
                      filteredAndSortedMataPelajaran.length > 0 ? (
                        <div className="space-y-2">
                          {filteredAndSortedMataPelajaran.map((mp: any) => (
                            <label key={mp.id} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded">
                              <input
                                type="checkbox"
                                checked={(formData.mataPelajaranIds || []).includes(mp.id)}
                                onChange={() => toggleMataPelajaran(mp.id)}
                                className="rounded border-white/20"
                              />
                              <span className="text-sm">{mp.nama} ({mp.kode})</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          Tidak ada mata pelajaran ditemukan
                        </p>
                      )
                    ) : (
                      <p className="text-sm text-muted-foreground">Loading mata pelajaran...</p>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pilih satu atau lebih mata pelajaran
                  </p>
                </div>

                {!item && (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
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
                        Password default: NIP guru (dapat diubah nanti)
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
      </div>
    </ModalPortal>
  );
}

function DeleteModal({ item, onClose, onConfirm, isLoading }: any) {
  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[99999] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />
          <Card className="relative z-50 w-full max-w-md transform overflow-hidden shadow-xl text-left">
            <CardHeader>
              <CardTitle>Hapus Guru</CardTitle>
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
      </div>
    </ModalPortal>
  );
}
