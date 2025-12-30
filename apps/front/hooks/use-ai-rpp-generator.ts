import { useState } from 'react';
import { GeneratedRppContent } from '../types/rpp';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface GenerateRppInput {
    mataPelajaran: string;
    materi: string;
    fase: string;
    alokasiWaktu: number;
    dimensiProfilLulusan: string[];
}

export function useAiRppGenerator() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateRpp = async (input: GenerateRppInput): Promise<GeneratedRppContent | null> => {
        setIsGenerating(true);
        setError(null);

        try {
            // Get token from localStorage (matching app's auth pattern)
            const authData = typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem('arunika-auth') || '{}')
                : {};
            const token = authData.token;

            const response = await fetch(`${API_BASE_URL}/rpp/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate RPP with AI');
            }

            const generated: GeneratedRppContent = await response.json();
            return generated;
        } catch (err: any) {
            setError(err.message || 'An error occurred while generating RPP');
            return null;
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        generateRpp,
        isGenerating,
        error,
    };
}
