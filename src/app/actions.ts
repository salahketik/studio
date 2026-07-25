'use server';

import { optimizeWebpCompression } from '@/ai/flows/optimize-webp-compression';
import type { OptimizeWebpCompressionInput } from '@/ai/flows/optimize-webp-compression';
import { generateBackground } from '@/ai/flows/generate-background';
import type { GenerateBackgroundInput } from '@/ai/flows/generate-background';

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
