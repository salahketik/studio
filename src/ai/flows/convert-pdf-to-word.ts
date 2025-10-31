'use server';

/**
 * @fileOverview Converts a PDF file to a Microsoft Word document (.docx) using AI.
 *
 * - convertPdfToWord - A function that handles the PDF to Word conversion.
 * - ConvertPdfToWordInput - The input type for the convertPdfToWord function.
 * - ConvertPdfToWordOutput - The return type for the convertPdfToWord function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertPdfToWordInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF file to convert, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type ConvertPdfToWordInput = z.infer<typeof ConvertPdfToWordInputSchema>;

const ConvertPdfToWordOutputSchema = z.object({
  docxDataUri: z
    .string()
    .describe(
      'The converted Microsoft Word document, as a data URI with the application/vnd.openxmlformats-officedocument.wordprocessingml.document MIME type.'
    ),
});
export type ConvertPdfToWordOutput = z.infer<typeof ConvertPdfToWordOutputSchema>;

export async function convertPdfToWord(
  input: ConvertPdfToWordInput
): Promise<ConvertPdfToWordOutput> {
  return convertPdfToWordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertPdfToWordPrompt',
  input: {schema: ConvertPdfToWordInputSchema},
  output: {schema: ConvertPdfToWordOutputSchema},
  prompt: `You are an expert document format converter. Your task is to convert the provided PDF file into a well-structured, editable Microsoft Word document (.docx).

  Analyze the PDF's structure, including headings, paragraphs, lists, tables, and images. Preserve the layout and formatting as closely as possible.

  PDF for conversion: {{media url=pdfDataUri}}
  
  Return the result as a .docx file encoded as a data URI.`,
});

const convertPdfToWordFlow = ai.defineFlow(
  {
    name: 'convertPdfToWordFlow',
    inputSchema: ConvertPdfToWordInputSchema,
    outputSchema: ConvertPdfToWordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
