'use server';

import { optimizeWebpCompression } from '@/ai/flows/optimize-webp-compression';
import type { OptimizeWebpCompressionInput } from '@/ai/flows/optimize-webp-compression';
import { convertPdfToWord } from '@/ai/flows/convert-pdf-to-word';
import { convertPdfToExcel } from '@/ai/flows/convert-pdf-to-excel';
import { convertPdfToPpt } from '@/ai/flows/convert-pdf-to-ppt';
import type { ConvertPdfToWordInput } from '@/ai/flows/convert-pdf-to-word';
import { generateBackground } from '@/ai/flows/generate-background';
import type { GenerateBackgroundInput } from '@/ai/flows/generate-background';
import { voiceToSrt } from '@/ai/flows/voice-to-srt';
import type { VoiceToSrtInput, VoiceToSrtOutput } from '@/ai/flows/voice-to-srt';

interface AIResult {
    optimizedImageUri?: string;
    compressionDetails?: string;
    error?: string;
}

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

interface PDFResult {
    dataUri?: string;
    error?: string;
}

export async function runPDFToWordConversion(
    input: ConvertPdfToWordInput
): Promise<PDFResult> {
    try {
        const result = await convertPdfToWord(input);
        return { dataUri: result.docxDataUri };
    } catch (error) {
        console.error('PDF to Word Error:', error);
        return { error: error instanceof Error ? error.message : 'Gagal konversi ke Word.' };
    }
}

export async function runPDFToExcelConversion(
    input: { pdfDataUri: string }
): Promise<PDFResult> {
    try {
        const result = await convertPdfToExcel(input);
        return { dataUri: result.excelDataUri };
    } catch (error) {
        console.error('PDF to Excel Error:', error);
        return { error: error instanceof Error ? error.message : 'Gagal konversi ke Excel.' };
    }
}

export async function runPDFToPptConversion(
    input: { pdfDataUri: string }
): Promise<PDFResult> {
    try {
        const result = await convertPdfToPpt(input);
        return { dataUri: result.pptDataUri };
    } catch (error) {
        console.error('PDF to PPT Error:', error);
        return { error: error instanceof Error ? error.message : 'Gagal konversi ke PowerPoint.' };
    }
}

interface AIImageResult {
    imageUrl?: string;
    error?: string;
}

export async function runAIGenerateBackground(
    input: GenerateBackgroundInput
): Promise<AIImageResult> {
    try {
        const result = await generateBackground(input);
        return { imageUrl: result.imageUrl };
    } catch (error) {
        console.error('AI Background Error:', error);
        return {
            error: error instanceof Error ? error.message : 'Gagal menghasilkan latar belakang AI.',
        };
    }
}

interface SRTResult extends Partial<VoiceToSrtOutput> {
  error?: string;
}

export async function runVoiceToSrtTranscription(
  input: VoiceToSrtInput
): Promise<SRTResult> {
  try {
    const result = await voiceToSrt(input);
    return result;
  } catch (error) {
    console.error('Voice to SRT Error:', error);
    return { error: error instanceof Error ? error.message : 'Gagal mentranskripsi audio ke SRT.' };
  }
}
