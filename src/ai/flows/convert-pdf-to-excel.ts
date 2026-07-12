'use server';

/**
 * @fileOverview Mengonversi file PDF ke Microsoft Excel (.xlsx) menggunakan AI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertPdfToExcelInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "File PDF untuk dikonversi, sebagai data URI. Format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type ConvertPdfToExcelInput = z.infer<typeof ConvertPdfToExcelInputSchema>;

const ConvertPdfToExcelOutputSchema = z.object({
  excelDataUri: z
    .string()
    .describe(
      'Dokumen Excel hasil konversi, sebagai data URI dengan MIME type application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.'
    ),
});
export type ConvertPdfToExcelOutput = z.infer<typeof ConvertPdfToExcelOutputSchema>;

export async function convertPdfToExcel(
  input: ConvertPdfToExcelInput
): Promise<ConvertPdfToExcelOutput> {
  return convertPdfToExcelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertPdfToExcelPrompt',
  input: {schema: ConvertPdfToExcelInputSchema},
  output: {schema: ConvertPdfToExcelOutputSchema},
  prompt: `Anda adalah ahli ekstraksi data terstruktur. Tugas Anda adalah menganalisis file PDF ini, mengidentifikasi semua tabel dan data numerik, dan mengubahnya menjadi file Microsoft Excel (.xlsx) yang rapi. 

Pastikan kolom dan baris selaras dengan data asli.

PDF untuk diekstraksi: {{media url=pdfDataUri}}
  
Kembalikan hasilnya sebagai file .xlsx dalam format data URI.`,
});

const convertPdfToExcelFlow = ai.defineFlow(
  {
    name: 'convertPdfToExcelFlow',
    inputSchema: ConvertPdfToExcelInputSchema,
    outputSchema: ConvertPdfToExcelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
