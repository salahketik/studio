
'use server';

import { optimizeWebpCompression } from '@/ai/flows/optimize-webp-compression';
import type { OptimizeWebpCompressionInput } from '@/ai/flows/optimize-webp-compression';
import { convertPdfToWord } from '@/ai/flows/convert-pdf-to-word';
import { convertPdfToExcel } from '@/ai/flows/convert-pdf-to-excel';
import { convertPdfToPpt } from '@/ai/flows/convert-pdf-to-ppt';

interface AIResult {
    optimizedImageUri?: string;
    compressionDetails?: string;
    error?: string;
}

/**
 * Menjalankan optimisasi WebP menggunakan AI Genkit.
 */
export async function runAIOptimization(
  input: OptimizeWebpCompressionInput
): Promise<AIResult> {
  try {
    const result = await optimizeWebpCompression(input);
    
    if (!result || !result.optimizedImageUri) {
        return { error: 'AI model did not return an optimized image.' };
    }

    return {
        optimizedImageUri: result.optimizedImageUri,
        compressionDetails: result.compressionDetails,
    };
  } catch (error) {
    console.error('AI Optimization Error:', error);
    return {
      error: error instanceof Error ? error.message : 'An unknown error occurred during AI optimization.',
    };
  }
}

/**
 * PDF Conversions Server Actions
 */
export async function runPDFToWordConversion(input: { pdfDataUri: string }) {
  try {
    const result = await convertPdfToWord(input);
    return { dataUri: result.docxDataUri };
  } catch (error: any) {
    return { error: error.message || 'Gagal konversi ke Word.' };
  }
}

export async function runPDFToExcelConversion(input: { pdfDataUri: string }) {
  try {
    const result = await convertPdfToExcel(input);
    return { dataUri: result.excelDataUri };
  } catch (error: any) {
    return { error: error.message || 'Gagal konversi ke Excel.' };
  }
}

export async function runPDFToPptConversion(input: { pdfDataUri: string }) {
  try {
    const result = await convertPdfToPpt(input);
    return { dataUri: result.pptDataUri };
  } catch (error: any) {
    return { error: error.message || 'Gagal konversi ke PowerPoint.' };
  }
}
