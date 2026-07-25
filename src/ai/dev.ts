'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/describe-image-properties.ts';
import '@/ai/flows/optimize-webp-compression.ts';
import '@/ai/flows/generate-background.ts';
import '@/ai/flows/voice-to-srt.ts';
