'use server';

/**
 * @fileOverview Optimizes WebP compression settings using AI based on user-specified information loss.
 *
 * - optimizeWebpCompression - A function that optimizes WebP compression.
 * - OptimizeWebpCompressionInput - The input type for the optimizeWebpCompression function.
 * - OptimizeWebpCompressionOutput - The return type for the optimizeWebpCompression function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeWebpCompressionInputSchema = z.object({
  imageUri: z
    .string()
    .describe(
      'The image to optimize, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  informationLossTolerance: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'The acceptable amount of information loss (0-100, where 0 is lossless and 100 is maximum loss).'
    ),
  description: z
    .string()
    .optional()
    .describe(
      'Optional description of the image content or desired use case to help the AI optimize compression settings.'
    ),
});
export type OptimizeWebpCompressionInput = z.infer<
  typeof OptimizeWebpCompressionInputSchema
>;

const OptimizeWebpCompressionOutputSchema = z.object({
  optimizedImageUri: z
    .string()
    .describe('The optimized WebP image, as a data URI.'),
  compressionDetails: z
    .string()
    .describe('Details about the compression settings used.'),
});
export type OptimizeWebpCompressionOutput = z.infer<
  typeof OptimizeWebpCompressionOutputSchema
>;

export async function optimizeWebpCompression(
  input: OptimizeWebpCompressionInput
): Promise<OptimizeWebpCompressionOutput> {
  return optimizeWebpCompressionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeWebpCompressionPrompt',
  input: {
    schema: OptimizeWebpCompressionInputSchema,
  },
  output: {
    schema: OptimizeWebpCompressionOutputSchema,
  },
  prompt: `You are an expert in WebP image compression. You will optimize the given image for WebP compression based on the user's specified information loss tolerance and optional description.

  You will return the optimized image as a data URI and details about the compression settings used.

  Here are the details:
  Image: {{media url=imageUri}}
  Information Loss Tolerance: {{informationLossTolerance}}%
  Description: {{description}}

  Optimize the image to balance file size and visual quality, considering the information loss tolerance and description.
  Return the optimized image as a data URI, and provide details about the compression settings used to achieve the optimized result.`,
});

const optimizeWebpCompressionFlow = ai.defineFlow(
  {
    name: 'optimizeWebpCompressionFlow',
    inputSchema: OptimizeWebpCompressionInputSchema,
    outputSchema: OptimizeWebpCompressionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
