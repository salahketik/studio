'use server';

/**
 * @fileOverview Optimizes WebP compression by describing image properties or desired end use.
 *
 * - describeImageProperties - A function that handles the image property description and optimization.
 * - DescribeImagePropertiesInput - The input type for the describeImageProperties function.
 * - DescribeImagePropertiesOutput - The return type for the describeImageProperties function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DescribeImagePropertiesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to compress, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  imageDescription: z
    .string()
    .describe(
      'A description of the image, its properties, or the desired end use.  This description will be used to optimize the WebP compression settings.'
    ),
});
export type DescribeImagePropertiesInput = z.infer<typeof DescribeImagePropertiesInputSchema>;

const DescribeImagePropertiesOutputSchema = z.object({
  optimizedSettings: z
    .string()
    .describe(
      'Optimized WebP compression settings based on the image description.'
    ),
});
export type DescribeImagePropertiesOutput = z.infer<typeof DescribeImagePropertiesOutputSchema>;

export async function describeImageProperties(
  input: DescribeImagePropertiesInput
): Promise<DescribeImagePropertiesOutput> {
  return describeImagePropertiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'describeImagePropertiesPrompt',
  input: {schema: DescribeImagePropertiesInputSchema},
  output: {schema: DescribeImagePropertiesOutputSchema},
  prompt: `You are an expert image compression specialist, particularly for WebP format.  You will take a description of the image and/or its intended use, and provide optimized WebP compression settings.

Description: {{{imageDescription}}}

Consider the image content and the desired end use to determine the best compression settings. Provide the settings as a string that can be directly used in WebP compression tools.

For example:
- If the description is "a high-resolution photograph for print", you might suggest settings that prioritize quality over file size.
- If the description is "a small icon for a website", you might suggest settings that aggressively reduce file size.

Ensure the settings are tailored to achieve the best balance between image quality and file size, based on the provided description.

Here is the image for context: {{media url=photoDataUri}}
`,
});

const describeImagePropertiesFlow = ai.defineFlow(
  {
    name: 'describeImagePropertiesFlow',
    inputSchema: DescribeImagePropertiesInputSchema,
    outputSchema: DescribeImagePropertiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
