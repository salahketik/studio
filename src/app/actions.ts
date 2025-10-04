'use server';

import { optimizeWebpCompression } from '@/ai/flows/optimize-webp-compression';
import type { OptimizeWebpCompressionInput } from '@/ai/flows/optimize-webp-compression';
import { trimImageWhitespace } from '@/ai/flows/trim-image-whitespace';
import type { TrimImageWhitespaceInput } from '@/ai/flows/trim-image-whitespace';

interface AIResult {
    optimizedImageUri?: string;
    compressionDetails?: string;
    error?: string;
}

interface AITrimResult {
    trimmedImageUri?: string;
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

export async function runAITrimming(
    input: TrimImageWhitespaceInput
): Promise<AITrimResult> {
    try {
        const result = await trimImageWhitespace(input);

        if (!result || !result.trimmedImageUri) {
            return { error: 'AI model did not return a trimmed image.' };
        }

        return {
            trimmedImageUri: result.trimmedImageUri,
        };
    } catch (error) {
        console.error('AI Trimming Error:', error);
        return {
            error: error instanceof Error ? error.message : 'An unknown error occurred during AI trimming.',
        };
    }
}
