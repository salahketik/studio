'use server';

/**
 * @fileOverview Trims whitespace from an image using AI.
 *
 * - trimImageWhitespace - A function that trims whitespace from an image.
 * - TrimImageWhitespaceInput - The input type for the trimImageWhitespace function.
 * - TrimImageWhitespaceOutput - The return type for the trimImageWhitespace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrimImageWhitespaceInputSchema = z.object({
  imageUri: z
    .string()
    .describe(
      "The image to trim, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TrimImageWhitespaceInput = z.infer<
  typeof TrimImageWhitespaceInputSchema
>;

const TrimImageWhitespaceOutputSchema = z.object({
  trimmedImageUri: z
    .string()
    .describe('The trimmed image, as a data URI.'),
});
export type TrimImageWhitespaceOutput = z.infer<
  typeof TrimImageWhitespaceOutputSchema
>;

export async function trimImageWhitespace(
  input: TrimImageWhitespaceInput
): Promise<TrimImageWhitespaceOutput> {
  return trimImageWhitespaceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'trimImageWhitespacePrompt',
  input: {
    schema: TrimImageWhitespaceInputSchema,
  },
  output: {
    schema: TrimImageWhitespaceOutputSchema,
  },
  prompt: `You are an expert image editing assistant. Your task is to trim the surrounding whitespace or uniform background from the given image.

  Identify the main subject in the image and determine its tightest possible bounding box.
  Crop the image to this bounding box, removing as much of the empty surrounding area as possible without cutting into the subject itself.

  Return the fully cropped image as a new image data URI.

  Here is the image: {{media url=imageUri}}
  `,
});

const trimImageWhitespaceFlow = ai.defineFlow(
  {
    name: 'trimImageWhitespaceFlow',
    inputSchema: TrimImageWhitespaceInputSchema,
    outputSchema: TrimImageWhitespaceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
