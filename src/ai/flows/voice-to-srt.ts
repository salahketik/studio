'use server';

/**
 * @fileOverview Menghasilkan file subtitle SRT dari rekaman suara menggunakan AI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VoiceToSrtInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "File audio untuk ditranskripsi, sebagai data URI. Format: 'data:audio/<mimetype>;base64,<encoded_data>'."
    ),
});
export type VoiceToSrtInput = z.infer<typeof VoiceToSrtInputSchema>;

const VoiceToSrtOutputSchema = z.object({
  srtContent: z.string().describe('Konten file SRT yang dihasilkan.'),
  transcript: z.string().describe('Transkrip teks lengkap tanpa stempel waktu.'),
});
export type VoiceToSrtOutput = z.infer<typeof VoiceToSrtOutputSchema>;

export async function voiceToSrt(input: VoiceToSrtInput): Promise<VoiceToSrtOutput> {
  return voiceToSrtFlow(input);
}

const voiceToSrtFlow = ai.defineFlow(
  {
    name: 'voiceToSrtFlow',
    inputSchema: VoiceToSrtInputSchema,
    outputSchema: VoiceToSrtOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      input: [
        { media: { url: input.audioDataUri } },
        {
          text: `Transkripsikan audio ini menjadi file subtitle SRT yang lengkap. 
          Patuhi format standar SRT:
          1
          00:00:00,000 --> 00:00:05,000
          Teks transkripsi.

          Pastikan stempel waktu akurat sesuai dengan suara yang terdengar. 
          Berikan output dalam JSON dengan key 'srtContent' untuk file SRT dan 'transcript' untuk teks narasi bersihnya.`,
        },
      ],
      output: {
        schema: VoiceToSrtOutputSchema,
      },
    });

    if (!output) {
      throw new Error('AI gagal mentranskripsi audio.');
    }

    return output;
  }
);
