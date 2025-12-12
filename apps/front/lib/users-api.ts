import { apiFetch } from './api-client';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'GURU' | 'SISWA';
    createdAt: string;
    updatedAt: string;
}

export interface UsersResponse {
    data: User[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreateUserData {
    email: string;
    name: string;
    password: string;
    role?: 'ADMIN' | 'GURU' | 'SISWA';
}

export interface UpdateUserData {
    email?: string;
    name?: string;
    password?: string;
    role?: 'ADMIN' | 'GURU' | 'SISWA';
}

export interface QueryUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'ADMIN' | 'GURU' | 'SISWA';
}

export const usersApi = {
    getUsers: async (params: QueryUsersParams = {}, token?: string | null) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set('page', params.page.toString());
        if (params.limit) searchParams.set('limit', params.limit.toString());
        if (params.search) searchParams.set('search', params.search);
        if (params.role) searchParams.set('role', params.role);

        const query = searchParams.toString();
        const path = `/users${query ? `?${query}` : ''}`;

        return apiFetch<UsersResponse>(path, {}, token);
    },

    getUser: async (id: string, token?: string | null) => {
        return apiFetch<User>(`/users/${id}`, {}, token);
    },

    createUser: async (data: CreateUserData, token?: string | null) => {
        return apiFetch<User>('/users', {
            method: 'POST',
            body: JSON.stringify(data),
        }, token);
    },

    updateUser: async (id: string, data: UpdateUserData, token?: string | null) => {
        return apiFetch<User>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }, token);
    },

    deleteUser: async (id: string, token?: string | null) => {
        return apiFetch<{ message: string }>(`/users/${id}`, {
            method: 'DELETE',
        }, token);
    },
};
