'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/describe-image-properties.ts';
import '@/ai/flows/optimize-webp-compression.ts';
import '@/ai/flows/trim-image-whitespace.ts';
