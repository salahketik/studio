'use server';

import { config } from 'dotenv';
config();

/**
 * Memuat alur AI yang aktif untuk Visual Creative Suite.
 * Hanya modul visual yang diimpor untuk menjaga efisiensi.
 */
import '@/ai/flows/describe-image-properties.ts';
import '@/ai/flows/optimize-webp-compression.ts';
import '@/ai/flows/generate-background.ts';
