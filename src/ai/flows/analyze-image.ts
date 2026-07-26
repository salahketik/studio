'use server';

/**
 * @fileOverview Menganalisis gambar untuk mengekstrak palet warna dan menghasilkan deskripsi SEO (Alt-Text).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "Foto untuk dianalisis, sebagai data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.object({
  altText: z.string().describe('Deskripsi singkat dan deskriptif untuk Alt-Text gambar.'),
  description: z.string().describe('Deskripsi mendalam tentang konten gambar.'),
  palette: z.array(z.object({
    hex: z.string(),
    name: z.string()
  })).describe('Daftar warna dominan yang ditemukan dalam gambar.'),
  tags: z.array(z.string()).describe('Kata kunci relevan untuk SEO.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      input: [
        { media: { url: input.photoDataUri } },
        {
          text: `Analisis gambar ini secara mendalam untuk kebutuhan desainer profesional.
          1. Berikan deskripsi Alt-Text yang ramah SEO.
          2. Jelaskan konten gambar secara mendalam.
          3. Ekstrak palet warna dominan (minimal 5 warna) dengan kode HEX dan nama warnanya.
          4. Berikan daftar tag kata kunci yang relevan.
          
          Kembalikan hasil dalam format JSON yang sesuai dengan skema output.`,
        },
      ],
      output: {
        schema: AnalyzeImageOutputSchema,
      },
    });

    if (!output) {
      throw new Error('AI gagal menganalisis gambar.');
    }

    return output;
  }
);
