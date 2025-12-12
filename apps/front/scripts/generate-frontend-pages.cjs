#!/usr/bin/env node

/**
 * Script to generate frontend pages for LMS entities
 * Usage: node generate-frontend-pages.js
 */

const fs = require('fs');
const path = require('path');

const entities = [
    {
        name: 'TahunAjaran',
        route: 'tahun-ajaran',
        title: 'Tahun Ajaran',
        titleSingular: 'Tahun Ajaran',
        fields: [
            { name: 'tahun', label: 'Tahun', type: 'text', required: true, placeholder: '2024/2025' },
            { name: 'semester', label: 'Semester', type: 'number', required: true, min: 1, max: 2 },
            { name: 'tanggalMulai', label: 'Tanggal Mulai', type: 'date', required: true },
            { name: 'tanggalSelesai', label: 'Tanggal Selesai', type: 'date', required: true },
            { name: 'status', label: 'Status', type: 'select', required: true, options: ['AKTIF', 'SELESAI', 'AKAN_DATANG'] },
        ],
        displayFields: ['tahun', 'semester', 'status'],
    },
    {
        name: 'MataPelajaran',
        route: 'mata-pelajaran',
        title: 'Mata Pelajaran',
        titleSingular: 'Mata Pelajaran',
        fields: [
            { name: 'kode', label: 'Kode', type: 'text', required: true, placeholder: 'MAT101' },
            { name: 'nama', label: 'Nama Mata Pelajaran', type: 'text', required: true },
            { name: 'jamPelajaran', label: 'Jam Pelajaran/Minggu', type: 'number', required: true },
            { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', required: false },
            { name: 'tingkat', label: 'Tingkat', type: 'select', required: true, options: ['X', 'XI', 'XII', 'SEMUA'] },
        ],
        displayFields: ['kode', 'nama', 'jamPelajaran', 'tingkat'],
    },
    {
        name: 'Guru',
        route: 'guru',
        title: 'Data Guru',
        titleSingular: 'Guru',
        fields: [
            { name: 'nip', label: 'NIP', type: 'text', required: true },
            { name: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'nomorTelepon', label: 'Nomor Telepon', type: 'tel', required: false },
            { name: 'status', label: 'Status', type: 'select', required: true, options: ['AKTIF', 'CUTI', 'PENSIUN'] },
        ],
        displayFields: ['nip', 'nama', 'email', 'status'],
    },
    {
        name: 'Kelas',
        route: 'kelas',
        title: 'Data Kelas',
        titleSingular: 'Kelas',
        fields: [
            { name: 'nama', label: 'Nama Kelas', type: 'text', required: true, placeholder: 'X IPA 1' },
            { name: 'tingkat', label: 'Tingkat', type: 'select', required: true, options: ['X', 'XI', 'XII'] },
            { name: 'jurusan', label: 'Jurusan', type: 'text', required: true, placeholder: 'IPA, IPS, RPL, dll' },
            { name: 'kapasitas', label: 'Kapasitas', type: 'number', required: true, min: 1 },
            { name: 'tahunAjaranId', label: 'Tahun Ajaran', type: 'select-api', required: true, apiEndpoint: 'tahun-ajaran' },
        ],
        displayFields: ['nama', 'tingkat', 'jurusan', 'kapasitas'],
    },
];

const baseDir = path.join(__dirname, '../app/(dashboard)');

function generatePage(entity) {
    const formFields = entity.fields.map(field => {
        if (field.type === 'select') {
            return `            <div>
              <label className="mb-2 block text-sm font-medium">${field.label}</label>
              <select
                ${field.required ? 'required' : ''}
                value={formData.${field.name} || ''}
                onChange={(e) => setFormData({ ...formData, ${field.name}: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              >
                <option value="">Pilih ${field.label}</option>
                ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('\n                ')}
              </select>
            </div>`;
        } else if (field.type === 'textarea') {
            return `            <div>
              <label className="mb-2 block text-sm font-medium">${field.label}</label>
              <textarea
                ${field.required ? 'required' : ''}
                value={formData.${field.name} || ''}
                onChange={(e) => setFormData({ ...formData, ${field.name}: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              />
            </div>`;
        } else {
            return `            <div>
              <label className="mb-2 block text-sm font-medium">${field.label}</label>
              <input
                type="${field.type}"
                ${field.required ? 'required' : ''}
                ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                ${field.min ? `min="${field.min}"` : ''}
                ${field.max ? `max="${field.max}"` : ''}
                value={formData.${field.name} || ''}
                onChange={(e) => setFormData({ ...formData, ${field.name}: ${field.type === 'number' ? 'parseInt(e.target.value)' : 'e.target.value'} })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
              />
            </div>`;
        }
    }).join('\n');

    return `"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "../role-context";

// TODO: Create API client in lib/${entity.route}-api.ts
const ${entity.name.toLowerCase()}Api = {
  getAll: async (params: any, token: string | null) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    
    const res = await fetch(\`http://localhost:3001/${entity.route}?\${searchParams}\`, {
      headers: { Authorization: \`Bearer \${token}\` },
    });
    return res.json();
  },
  create: async (data: any, token: string | null) => {
    const res = await fetch(\`http://localhost:3001/${entity.route}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${token}\` },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  update: async (id: string, data: any, token: string | null) => {
    const res = await fetch(\`http://localhost:3001/${entity.route}/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${token}\` },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (id: string, token: string | null) => {
    const res = await fetch(\`http://localhost:3001/${entity.route}/\${id}\`, {
      method: 'DELETE',
      headers: { Authorization: \`Bearer \${token}\` },
    });
    return res.json();
  },
};

export default function ${entity.name}Page() {
  const { token } = useRole();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["${entity.route}", page, search],
    queryFn: () => ${entity.name.toLowerCase()}Api.getAll({ page, limit: 10, search: search || undefined }, token),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => ${entity.name.toLowerCase()}Api.create(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["${entity.route}"] });
      setIsCreateModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => ${entity.name.toLowerCase()}Api.update(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["${entity.route}"] });
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ${entity.name.toLowerCase()}Api.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["${entity.route}"] });
      setDeletingItem(null);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">${entity.title}</h1>
          <p className="text-muted-foreground">Kelola data ${entity.title.toLowerCase()}</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} />
          Tambah ${entity.titleSingular}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Daftar ${entity.title}</CardTitle>
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
                      ${entity.displayFields.map(f => `<th className="pb-3 font-medium">${entity.fields.find(field => field.name === f)?.label || f}</th>`).join('\n                      ')}
                      <th className="pb-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((item: any) => (
                      <tr key={item.id} className="border-b border-white/5 transition hover:bg-white/5">
                        ${entity.displayFields.map(f => `<td className="py-4">{item.${f}}</td>`).join('\n                        ')}
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
          title="Tambah ${entity.titleSingular}"
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      )}

      {editingItem && (
        <FormModal
          title="Edit ${entity.titleSingular}"
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
${formFields}
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
          <CardTitle>Hapus ${entity.titleSingular}</CardTitle>
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
`;
}

// Generate pages
entities.forEach(entity => {
    const pageDir = path.join(baseDir, entity.route);

    if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(pageDir, 'page.tsx'),
        generatePage(entity)
    );

    console.log(`✓ Generated ${entity.name} page`);
});

console.log('\n✅ All frontend pages generated successfully!');
console.log('\nPages created:');
entities.forEach(e => console.log(`  - /${e.route}`));
