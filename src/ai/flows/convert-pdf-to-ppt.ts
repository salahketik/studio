'use server';

/**
 * @fileOverview Mengonversi file PDF ke Microsoft PowerPoint (.pptx) menggunakan AI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertPdfToPptInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "File PDF untuk dikonversi, sebagai data URI. Format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type ConvertPdfToPptInput = z.infer<typeof ConvertPdfToPptInputSchema>;

const ConvertPdfToPptOutputSchema = z.object({
  pptDataUri: z
    .string()
    .describe(
      'Dokumen PowerPoint hasil konversi, sebagai data URI dengan MIME type application/vnd.openxmlformats-officedocument.presentationml.presentation.'
    ),
});
export type ConvertPdfToPptOutput = z.infer<typeof ConvertPdfToPptOutputSchema>;

export async function convertPdfToPpt(
  input: ConvertPdfToPptInput
): Promise<ConvertPdfToPptOutput> {
  return convertPdfToPptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertPdfToPptPrompt',
  input: {schema: ConvertPdfToPptInputSchema},
  output: {schema: ConvertPdfToPptOutputSchema},
  prompt: `Anda adalah desainer presentasi profesional. Ubah file PDF ini menjadi file Microsoft PowerPoint (.pptx) yang dapat diedit. Pertahankan elemen desain, teks, dan tata letak per halaman agar menjadi slide yang fungsional.

PDF untuk dikonversi: {{media url=pdfDataUri}}
  
Kembalikan hasilnya sebagai file .pptx dalam format data URI.`,
});

const convertPdfToPptFlow = ai.defineFlow(
  {
    name: 'convertPdfToPptFlow',
    inputSchema: ConvertPdfToPptInputSchema,
    outputSchema: ConvertPdfToPptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
