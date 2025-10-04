'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically determining the best feature engineering steps for exoplanet data.
 *
 * The flow takes exoplanet data as input and returns the engineered features.
 * - featureEngineeringPipeline - A function that orchestrates the feature engineering process.
 * - FeatureEngineeringInput - The input type for the featureEngineeringPipeline function.
 * - FeatureEngineeringOutput - The return type for the featureEngineeringPipeline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FeatureEngineeringInputSchema = z.object({
  orbitalPeriod: z.number().describe('The orbital period of the exoplanet.'),
  transitDuration: z.number().describe('The duration of the transit.'),
  planetaryRadius: z.number().describe('The radius of the planet.'),
  transitDepth: z.number().describe('The transit depth.'),
  snr: z.number().describe('The signal-to-noise ratio.'),
  missingDataStrategy: z
    .enum(['mean', 'median', 'drop'])
    .default('mean')
    .describe(
      'Strategy for handling missing data: mean, median, or drop rows/columns.'
    ),
  normalizationStrategy:
    z
      .enum(['minmax', 'zscore', 'none'])
      .default('minmax')
      .describe(
        'Strategy for normalization: minmax (scale to [0, 1]), zscore (standardize), or none.'
      ),
});
export type FeatureEngineeringInput = z.infer<typeof FeatureEngineeringInputSchema>;

const FeatureEngineeringOutputSchema = z.object({
  engineeredFeatures: z.record(z.number()).describe('The engineered features.'),
  featureEngineeringSteps: z
    .string()
    .describe('The steps taken during feature engineering.'),
});
export type FeatureEngineeringOutput = z.infer<typeof FeatureEngineeringOutputSchema>;

export async function featureEngineeringPipeline(
  input: FeatureEngineeringInput
): Promise<FeatureEngineeringOutput> {
  return featureEngineeringFlow(input);
}

const determineFeatureEngineeringSteps = ai.defineTool({
  name: 'determineFeatureEngineeringSteps',
  description:
    'Determine the optimal feature engineering steps for exoplanet data. ' +
    'This includes cleaning, normalization, and feature extraction. ' +
    'Based on data properties such as missing values and value distributions.',
  inputSchema: FeatureEngineeringInputSchema,
  outputSchema: z.object({
    steps: z.string().describe('A description of the feature engineering steps.'),
  }),
},
async input => {
  // Simulate determination of optimal steps based on data properties.
  // In a real application, this would involve analyzing the data.
  return {
    steps: `Missing data strategy: ${input.missingDataStrategy}. Normalization strategy: ${input.normalizationStrategy}. Features extracted and cleaned.`,
  };
});

const featureEngineeringPrompt = ai.definePrompt({
  name: 'featureEngineeringPrompt',
  tools: [determineFeatureEngineeringSteps],
  input: {schema: FeatureEngineeringInputSchema},
  output: {schema: FeatureEngineeringOutputSchema},
  prompt: `You are an expert data scientist. Based on the exoplanet data provided and the recommended feature engineering steps, generate the engineered features.

Exoplanet Data:
{{json input}}

Feature Engineering Steps: Use the determineFeatureEngineeringSteps tool to determine what steps to use.

Output the engineered features and a description of the feature engineering steps taken.
`,
});

const featureEngineeringFlow = ai.defineFlow(
  {
    name: 'featureEngineeringFlow',
    inputSchema: FeatureEngineeringInputSchema,
    outputSchema: FeatureEngineeringOutputSchema,
  },
  async input => {
    const {output} = await featureEngineeringPrompt(input);
    // Simulate the feature engineering process.
    const engineeredFeatures = {
      engineeredFeature1: input.orbitalPeriod * 2,
      engineeredFeature2: input.transitDuration / 2,
      engineeredFeature3: input.planetaryRadius + 1,
      engineeredFeature4: input.transitDepth - 1,
      engineeredFeature5: input.snr * 10,
    };

    return {
      engineeredFeatures,
      featureEngineeringSteps: output?.engineeredFeatures.toString() ?? 'No steps taken.',
    };
  }
);
