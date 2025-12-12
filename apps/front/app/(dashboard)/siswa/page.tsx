"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Trash2, Plus, Upload, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "../role-context";

export default function SiswaPage() {
  const { token } = useRole();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["siswa", page, search],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3001/siswa?page=${page}&limit=10&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    },
    onError: (error: any) => {
      alert(`Error: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: any) => {
      const res = await fetch(`http://localhost:3001/siswa/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siswa"] });
      setEditingItem(null);
    },
    onError: (error: any) => {
      alert(`Error: ${error.message}`);
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Siswa</CardTitle>
              <p className="text-sm text-muted-foreground">Kelola data siswa</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsImportModalOpen(true)} variant="outline">
                <Upload size={16} />
                Import Excel
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
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-primary/60 focus:bg-white/10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full w-full">
                      <thead>
                        <tr className="border-b border-white/10 text-left text-sm text-muted-foreground">
                          <th className="pb-3 font-medium">NISN</th>
                          <th className="pb-3 font-medium">Nama</th>
                          <th className="pb-3 font-medium">Email</th>
                          <th className="pb-3 font-medium">Kelas</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.data.map((item: any) => (
                          <tr key={item.id} className="border-b border-white/5 transition hover:bg-white/5">
                            <td className="py-4">{item.nisn}</td>
                            <td className="py-4">{item.nama}</td>
                            <td className="py-4">{item.email || '-'}</td>
                            <td className="py-4">{item.kelas?.nama || '-'}</td>
                            <td className="py-4">{item.status}</td>
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
                </div>
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
    const { id, createdAt, updatedAt, deletedAt, kelas, user, userId, ...cleanData } = formData;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
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
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Tanggal Lahir</label>
              <input
                type="date"
                required
                value={formData.tanggalLahir?.split('T')[0] || ''}
                onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Alamat</label>
              <textarea
                value={formData.alamat || ''}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
                rows={2}
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
              <label className="mb-2 block text-sm font-medium">Kelas</label>
              <select
                value={formData.kelasId || ''}
                onChange={(e) => setFormData({ ...formData, kelasId: e.target.value || undefined })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
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
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              >
                <option value="AKTIF">AKTIF</option>
                <option value="MAGANG">MAGANG</option>
                <option value="PINDAH">PINDAH</option>
                <option value="ALUMNI">ALUMNI</option>
              </select>
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
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `NISN,Nama Lengkap,Tanggal Lahir,Email,Alamat,Nomor Telepon,Status,Kelas,Buat Akun
1234567890,Budi Santoso,2005-01-15,budi@student.com,Jl. Merdeka No. 123,081234567890,AKTIF,X IPA 1,Ya
1234567891,Siti Nurhaliza,2005-03-20,siti@student.com,Jl. Sudirman No. 45,081234567891,AKTIF,X IPA 1,Ya`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_import_siswa.csv';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
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

          <div className="border-t border-white/10 pt-4">
            <label className="mb-2 block text-sm font-medium">Pilih File Excel/CSV</label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none transition focus:border-primary/60 focus:bg-white/10"
            />
            {file && (
              <p className="mt-2 text-xs text-muted-foreground">
                File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {result && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
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
