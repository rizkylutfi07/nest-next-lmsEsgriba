import { useState } from 'react';
import { GeneratedRppContent } from '../types/rpp';

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
            const response = await fetch('/api/rpp/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
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
