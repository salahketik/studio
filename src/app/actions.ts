'use server';

import { optimizeWebpCompression } from '@/ai/flows/optimize-webp-compression';
import type { OptimizeWebpCompressionInput } from '@/ai/flows/optimize-webp-compression';
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
