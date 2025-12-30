'use client';

import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export type PaperSize = 'A4' | 'F4';

interface PaperDimensions {
    width: number;
    height: number;
    label: string;
}

export const PAPER_SIZES: Record<PaperSize, PaperDimensions> = {
    A4: { width: 210, height: 297, label: 'A4 (210 x 297 mm)' },
    F4: { width: 215.9, height: 330.2, label: 'F4/Folio (215.9 x 330.2 mm)' },
};

interface UseRppPdfOptions {
    filename?: string;
    quality?: number;
    paperSize?: PaperSize;
}

export function useRppPdf() {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePdf = useCallback(async (
        element: HTMLElement | null,
        options: UseRppPdfOptions = {}
    ) => {
        if (!element) {
            toast.error('Konten tidak ditemukan');
            return;
        }

        const { filename = 'RPP', quality = 2, paperSize = 'A4' } = options;
        const { width: imgWidth, height: pageHeight } = PAPER_SIZES[paperSize];

        setIsGenerating(true);
        toast.info('Membuat PDF...');

        try {
            // Hide non-printable elements temporarily
            const hiddenElements = element.querySelectorAll('.print\\:hidden, [data-no-pdf]');
            hiddenElements.forEach(el => {
                (el as HTMLElement).style.display = 'none';
            });

            // Generate canvas from the element
            const canvas = await html2canvas(element, {
                scale: quality,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            } as Parameters<typeof html2canvas>[1]);

            // Restore hidden elements
            hiddenElements.forEach(el => {
                (el as HTMLElement).style.display = '';
            });

            // Calculate PDF dimensions
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Create PDF with custom size
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: [imgWidth, pageHeight],
            });

            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(
                canvas.toDataURL('image/jpeg', 0.95),
                'JPEG',
                0,
                position,
                imgWidth,
                imgHeight
            );
            heightLeft -= pageHeight;

            // Add additional pages if content is longer than one page
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage([imgWidth, pageHeight]);
                pdf.addImage(
                    canvas.toDataURL('image/jpeg', 0.95),
                    'JPEG',
                    0,
                    position,
                    imgWidth,
                    imgHeight
                );
                heightLeft -= pageHeight;
            }

            // Save the PDF
            const safeFilename = filename.replace(/[^a-zA-Z0-9-_]/g, '_');
            pdf.save(`${safeFilename}.pdf`);

            toast.success('PDF berhasil diunduh!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Gagal membuat PDF. Silakan coba lagi.');
        } finally {
            setIsGenerating(false);
        }
    }, []);

    return {
        generatePdf,
        isGenerating,
        paperSizes: PAPER_SIZES,
    };
}

// Utility to clean markdown from text
export function cleanMarkdown(text: string | null | undefined): string {
    if (!text) return '';
    return text
        .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove bold **text**
        .replace(/\*([^*]+)\*/g, '$1')       // Remove italic *text*
        .replace(/#{1,6}\s*/g, '')           // Remove headers #
        .replace(/`([^`]+)`/g, '$1')         // Remove inline code
        .replace(/~~([^~]+)~~/g, '$1')       // Remove strikethrough
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
        .trim();
}
