"use client";
import { API_URL } from "@/lib/api";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Calendar, Clock, Download, Bookmark, Share2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { materiApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function MateriDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [materi, setMateri] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadMateri(params.id as string);
        }
    }, [params.id]);

    const loadMateri = async (id: string) => {
        try {
            setLoading(true);
            // Increment view count when loading
            const response = await materiApi.getOne(id) as any;
            setMateri(response);
            setIsBookmarked(response?.isBookmarked || false);
        } catch (error) {
            console.error("Error loading materi:", error);
            toast({ title: "Error", description: "Gagal memuat materi", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleBookmark = async () => {
        if (!materi) return;
        try {
            setBookmarkLoading(true);
            await materiApi.toggleBookmark(materi.id);
            setIsBookmarked(!isBookmarked);
            toast({
                title: isBookmarked ? "Dihapus dari Bookmark" : "Disimpan ke Bookmark",
                description: isBookmarked ? "Materi telah dihapus dari bookmark" : "Materi telah disimpan ke bookmark",
            });
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            toast({ title: "Error", description: "Gagal mengubah bookmark", variant: "destructive" });
        } finally {
            setBookmarkLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!materi) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-muted-foreground">Materi tidak ditemukan</p>
                <Button onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{materi.judul}</h1>
                    <p className="text-muted-foreground mt-1">
                        {materi.mataPelajaran?.nama || "N/A"}
                    </p>
                </div>
                <Badge tone="info" className="text-sm">
                    {materi.tipe}
                </Badge>
            </div>

            {/* Metadata Card */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground text-xs">Pengampu</p>
                                <p className="font-medium">{materi.guru?.user?.name || materi.guru?.nama || "N/A"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground text-xs">Dibuat</p>
                                <p className="font-medium">{new Date(materi.createdAt).toLocaleDateString("id-ID")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground text-xs">Views</p>
                                <p className="font-medium">{materi.viewCount || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground text-xs">Update</p>
                                <p className="font-medium">{new Date(materi.updatedAt).toLocaleDateString("id-ID")}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Description */}
            {materi.deskripsi && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Deskripsi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{materi.deskripsi}</p>
                    </CardContent>
                </Card>
            )}

            {/* Content */}
            {materi.konten && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Konten Materi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {materi.konten.startsWith('file://') ? (
                            // Uploaded file
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">File materi yang diupload:</p>
                                    {materi.konten.endsWith('.html') && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const iframe = document.getElementById('materi-iframe') as HTMLIFrameElement;
                                                if (iframe) {
                                                    if (document.fullscreenElement) {
                                                        document.exitFullscreen();
                                                    } else {
                                                        iframe.requestFullscreen();
                                                    }
                                                }
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="mr-2"
                                            >
                                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                                            </svg>
                                            Fullscreen
                                        </Button>
                                    )}
                                </div>
                                {materi.konten.endsWith('.html') ? (
                                    // Render HTML in iframe
                                    <iframe
                                        id="materi-iframe"
                                        src={`${API_URL}/uploads/materi/${materi.konten.replace('file://', '')}`}
                                        className="w-full h-[600px] border rounded-lg"
                                        title="Materi Content"
                                        allowFullScreen
                                    />
                                ) : (
                                    // PDF or other docs - provide download link
                                    <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
                                        <div className="flex-1">
                                            <p className="font-medium">{materi.konten.replace('file://', '')}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {materi.konten.endsWith('.pdf') ? 'PDF Document' :
                                                    materi.konten.endsWith('.docx') ? 'Word Document' :
                                                        'Document'}
                                            </p>
                                        </div>
                                        <Button asChild>
                                            <a
                                                href={`${API_URL}/uploads/materi/${materi.konten.replace('file://', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                            >
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : materi.konten.startsWith('http') ? (
                            // External URL link
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">Link eksternal:</p>
                                <Button asChild className="w-full">
                                    <a href={materi.konten} target="_blank" rel="noopener noreferrer">
                                        Buka Link
                                        <Share2 className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        ) : (
                            // Text content
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <p className="whitespace-pre-wrap">{materi.konten}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Attachments */}
            {materi.attachments && materi.attachments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">File Lampiran</CardTitle>
                        <CardDescription>{materi.attachments.length} file tersedia</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {materi.attachments.map((file: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <Download className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{file.namaFile}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(file.ukuranFile / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
                <Button
                    variant={isBookmarked ? "default" : "outline"}
                    className="flex-1"
                    onClick={handleBookmark}
                    disabled={bookmarkLoading}
                >
                    <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                    {bookmarkLoading ? "Loading..." : isBookmarked ? "Tersimpan" : "Simpan ke Bookmark"}
                </Button>
                <Button variant="outline">
                    <Share2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
