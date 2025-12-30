export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('arunika-auth') || '{}').token
        : null;

    const headers: any = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new ApiError(response.status, error.message || 'Request failed', error);
    }

    return response.json();
}

// Materi API
export const materiApi = {
    getAll: (filters?: { mataPelajaranId?: string; kelasId?: string }) =>
        fetchApi(`/materi?${new URLSearchParams(filters as any)}`),

    getOne: (id: string) =>
        fetchApi(`/materi/${id}`),

    create: (data: any) =>
        fetchApi('/materi', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    createWithFile: async (formData: FormData) => {
        const token = typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('arunika-auth') || '{}').token
            : null;

        console.log('Token found:', token ? 'Yes' : 'No');
        console.log('Uploading to:', `${API_URL}/materi`);

        const response = await fetch(`${API_URL}/materi`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload error response:', errorText);
            let error;
            try {
                error = JSON.parse(errorText);
            } catch {
                error = { message: errorText || 'Upload failed' };
            }
            throw new Error(error.message || 'Upload failed');
        }

        return response.json();
    },

    update: (id: string, data: any) =>
        fetchApi(`/materi/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi(`/materi/${id}`, {
            method: 'DELETE',
        }),

    toggleBookmark: (id: string) =>
        fetchApi(`/materi/${id}/bookmark`, {
            method: 'POST',
        }),
};

// Tugas API
export const tugasApi = {
    getAll: (filters?: { mataPelajaranId?: string; kelasId?: string; myAssignments?: string }) =>
        fetchApi(`/tugas?${new URLSearchParams(filters as any)}`),

    getOne: (id: string) =>
        fetchApi(`/tugas/${id}`),

    create: (data: any) =>
        fetchApi('/tugas', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    createWithFiles: async (formData: FormData) => {
        const token = typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('arunika-auth') || '{}').token
            : null;

        const response = await fetch(`${API_URL}/tugas`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Upload failed' }));
            throw new Error(error.message || 'Upload failed');
        }

        return response.json();
    },

    update: (id: string, data: any) =>
        fetchApi(`/tugas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi(`/tugas/${id}`, {
            method: 'DELETE',
        }),

    getSubmissions: (tugasId: string) =>
        fetchApi(`/tugas/${tugasId}/submissions`),

    submit: async (tugasId: string, formData: FormData) => {
        const token = typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('arunika-auth') || '{}').token
            : null;

        const response = await fetch(`${API_URL}/tugas/${tugasId}/submit`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Submit failed' }));
            throw new Error(error.message || 'Submit failed');
        }

        return response.json();
    },

    grade: (tugasId: string, siswaId: string, data: { score: number; feedback?: string }) =>
        fetchApi(`/tugas/${tugasId}/grade/${siswaId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};

// Notifikasi API
export const notifikasiApi = {
    getAll: (filters?: { isRead?: boolean }) =>
        fetchApi(`/notifikasi${filters?.isRead !== undefined ? `?isRead=${filters.isRead}` : ''}`),

    getUnreadCount: () =>
        fetchApi('/notifikasi/unread-count'),

    markAsRead: (id: string) =>
        fetchApi(`/notifikasi/${id}/read`, {
            method: 'PUT',
        }),

    markAllAsRead: () =>
        fetchApi('/notifikasi/mark-all-read', {
            method: 'PUT',
        }),

    delete: (id: string) =>
        fetchApi(`/notifikasi/${id}`, {
            method: 'DELETE',
        }),
};

// Forum API
export const forumApi = {
    getThreads: (kategoriId?: string) =>
        fetchApi(`/forum/threads${kategoriId ? `?kategoriId=${kategoriId}` : ''}`),

    getThread: (id: string) =>
        fetchApi(`/forum/threads/${id}`),

    createThread: (data: any) =>
        fetchApi('/forum/threads', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    createPost: (threadId: string, data: any) =>
        fetchApi(`/forum/threads/${threadId}/posts`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    toggleReaction: (postId: string, tipe: string) =>
        fetchApi(`/forum/posts/${postId}/reactions`, {
            method: 'POST',
            body: JSON.stringify({ tipe }),
        }),
};

// Mata Pelajaran API (for dropdowns)
export const mataPelajaranApi = {
    getAll: (params?: { limit?: number; page?: number; search?: string; mySubjects?: string }) =>
        fetchApi(`/mata-pelajaran?${new URLSearchParams(params as any)}`),
};

// Kelas API (for dropdowns)
export const kelasApi = {
    getAll: (params?: { limit?: number; page?: number; search?: string }) =>
        fetchApi(`/kelas?${new URLSearchParams(params as any)}`),
};

// Guru API (for dropdowns)
export const guruApi = {
    getAll: (params?: { limit?: number; page?: number; search?: string }) =>
        fetchApi(`/guru${params ? `?${new URLSearchParams(params as any).toString()}` : ''}`),
    getById: (id: string) =>
        fetchApi(`/guru/${id}`),
};

export const analyticsApi = {
    getStudentDashboard: () =>
        fetchApi('/analytics/dashboard'),
    getUpcomingTasks: () =>
        fetchApi('/analytics/upcoming-tasks'),
    getAdminDashboard: () =>
        fetchApi('/analytics/admin'),
    getGuruDashboard: () =>
        fetchApi('/analytics/guru'),
};

// RPP API
export const rppApi = {
    getAll: (params?: {
        mataPelajaranId?: string;
        kelasId?: string;
        guruId?: string;
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }) =>
        fetchApi(`/rpp?${new URLSearchParams(params as any).toString()}`),

    getOne: (id: string) =>
        fetchApi(`/rpp/${id}`),

    getMyRpp: (params?: { search?: string; page?: number; limit?: number }) =>
        fetchApi(`/rpp/my?${new URLSearchParams(params as any).toString()}`),

    getStats: () =>
        fetchApi('/rpp/stats'),

    create: (data: any) =>
        fetchApi('/rpp', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: any) =>
        fetchApi(`/rpp/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi(`/rpp/${id}`, {
            method: 'DELETE',
        }),

    publish: (id: string) =>
        fetchApi(`/rpp/${id}/publish`, {
            method: 'POST',
        }),

    duplicate: (id: string) =>
        fetchApi(`/rpp/${id}/duplicate`, {
            method: 'POST',
        }),
};
