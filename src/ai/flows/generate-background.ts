'use server';

/**
 * @fileOverview Menghasilkan gambar latar belakang artistik menggunakan AI Imagen 4.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBackgroundInputSchema = z.object({
  prompt: z.string().describe('Deskripsi latar belakang yang diinginkan.'),
});
export type GenerateBackgroundInput = z.infer<typeof GenerateBackgroundInputSchema>;

const GenerateBackgroundOutputSchema = z.object({
  imageUrl: z.string().describe('Data URI gambar yang dihasilkan.'),
});
export type GenerateBackgroundOutput = z.infer<typeof GenerateBackgroundOutputSchema>;

export async function generateBackground(input: GenerateBackgroundInput): Promise<GenerateBackgroundOutput> {
  return generateBackgroundFlow(input);
}

const generateBackgroundFlow = ai.defineFlow(
  {
    name: 'generateBackgroundFlow',
    inputSchema: GenerateBackgroundInputSchema,
    outputSchema: GenerateBackgroundOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `A professional, high-quality, artistic background for a product mockup. Theme: ${input.prompt}. No text, no people, clean composition, studio lighting.`,
    });

    if (!media || !media.url) {
      throw new Error('Gagal menghasilkan gambar AI.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
