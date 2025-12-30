'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { rppApi } from '@/lib/api';
import { RPP, RPPListResponse, StatusRPP, StatusRPPLabels } from '@/types/rpp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    FileText,
    Plus,
    Search,
    MoreVertical,
    Eye,
    Edit,
    Copy,
    Trash2,
    CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function RppPage() {
    const router = useRouter();
    const [rppList, setRppList] = useState<RPP[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 20;

    useEffect(() => {
        fetchRpp();
    }, [page, search]);

    const fetchRpp = async () => {
        try {
            setLoading(true);
            const response: RPPListResponse = await rppApi.getAll({
                search,
                page,
                limit,
            });
            setRppList(response.data);
            setTotal(response.meta.total);
        } catch (error: any) {
            toast.error(error.message || 'Gagal memuat data RPP');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus RPP ini?')) return;

        try {
            await rppApi.delete(id);
            toast.success('RPP berhasil dihapus');
            fetchRpp();
        } catch (error: any) {
            toast.error(error.message || 'Gagal menghapus RPP');
        }
    };

    const handleDuplicate = async (id: string) => {
        try {
            await rppApi.duplicate(id);
            toast.success('RPP berhasil diduplikasi');
            fetchRpp();
        } catch (error: any) {
            toast.error(error.message || 'Gagal menduplikasi RPP');
        }
    };

    const handlePublish = async (id: string) => {
        try {
            await rppApi.publish(id);
            toast.success('RPP berhasil dipublikasikan');
            fetchRpp();
        } catch (error: any) {
            toast.error(error.message || 'Gagal mempublikasikan RPP');
        }
    };

    const getStatusBadge = (status: StatusRPP) => {
        const colors = {
            [StatusRPP.DRAFT]: 'bg-gray-100 text-gray-800',
            [StatusRPP.PUBLISHED]: 'bg-green-100 text-green-800',
            [StatusRPP.ARCHIVED]: 'bg-yellow-100 text-yellow-800',
        };

        return (
            <Badge className={colors[status]}>
                {StatusRPPLabels[status]}
            </Badge>
        );
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <FileText className="h-6 w-6" />
                                RPP Deep Learning
                            </CardTitle>
                            <CardDescription>
                                Kelola Rencana Pelaksanaan Pembelajaran dengan Pendekatan Deep Learning
                            </CardDescription>
                        </div>
                        <Button onClick={() => router.push('/rpp/create')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Buat RPP Baru
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari RPP berdasarkan kode, materi, atau topik..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Memuat data...</p>
                        </div>
                    ) : rppList.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Belum ada RPP
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Mulai dengan membuat RPP Deep Learning pertama Anda
                            </p>
                            <Button onClick={() => router.push('/rpp/create')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Buat RPP Baru
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Kode</TableHead>
                                            <TableHead>Mata Pelajaran</TableHead>
                                            <TableHead>Materi</TableHead>
                                            <TableHead>Alokasi Waktu</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rppList.map((rpp) => (
                                            <TableRow key={rpp.id}>
                                                <TableCell className="font-medium">
                                                    {rpp.kode}
                                                </TableCell>
                                                <TableCell>
                                                    {rpp.mataPelajaran?.nama || '-'}
                                                </TableCell>
                                                <TableCell>{rpp.materi}</TableCell>
                                                <TableCell>{rpp.alokasiWaktu} menit</TableCell>
                                                <TableCell>
                                                    {getStatusBadge(rpp.status)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => router.push(`/rpp/${rpp.id}`)}
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Lihat Detail
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => router.push(`/rpp/${rpp.id}/edit`)}
                                                            >
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            {rpp.status === StatusRPP.DRAFT && (
                                                                <DropdownMenuItem
                                                                    onClick={() => handlePublish(rpp.id)}
                                                                >
                                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                                    Publikasikan
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem
                                                                onClick={() => handleDuplicate(rpp.id)}
                                                            >
                                                                <Copy className="h-4 w-4 mr-2" />
                                                                Duplikat
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(rpp.id)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {total > limit && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-600">
                                        Menampilkan {(page - 1) * limit + 1} - {Math.min(page * limit, total)} dari {total} RPP
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            Sebelumnya
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => p + 1)}
                                            disabled={page * limit >= total}
                                        >
                                            Selanjutnya
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
