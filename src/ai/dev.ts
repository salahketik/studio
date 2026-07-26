'use server';

import { config } from 'dotenv';
config();

/**
 * Memuat alur AI yang aktif untuk Visual Creative Suite.
 * Menambahkan modul analisis gambar dan optimisasi.
 */
import '@/ai/flows/describe-image-properties.ts';
import '@/ai/flows/optimize-webp-compression.ts';
import '@/ai/flows/generate-background.ts';
import '@/ai/flows/analyze-image.ts';
