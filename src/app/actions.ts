'use server';

import { optimizeWebpCompression } from '@/ai/flows/optimize-webp-compression';
import type { OptimizeWebpCompressionInput } from '@/ai/flows/optimize-webp-compression';
import { generateBackground } from '@/ai/flows/generate-background';
import type { GenerateBackgroundInput } from '@/ai/flows/generate-background';
import { analyzeImage } from '@/ai/flows/analyze-image';
import type { AnalyzeImageInput, AnalyzeImageOutput } from '@/ai/flows/analyze-image';

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

interface AIAnalysisResult extends Partial<AnalyzeImageOutput> {
    error?: string;
}

export async function runAIAnalyzeImage(
    input: AnalyzeImageInput
): Promise<AIAnalysisResult> {
    try {
        const result = await analyzeImage(input);
        return result;
    } catch (error) {
        console.error('AI Vision Error:', error);
        return {
            error: error instanceof Error ? error.message : 'Gagal menganalisis gambar dengan AI.',
        };
    }
}
