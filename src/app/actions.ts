'use server';

import { z } from 'zod';
import {
  featureEngineeringPipeline,
  type FeatureEngineeringInput,
} from '@/ai/flows/feature-engineering-pipeline';
import {
  explainablePredictions,
  type ExplainablePredictionsInput,
} from '@/ai/flows/explainable-predictions';

const formSchema = z.object({
  orbitalPeriod: z.coerce.number().positive(),
  transitDuration: z.coerce.number().positive(),
  planetaryRadius: z.coerce.number().positive(),
  transitDepth: z.coerce.number().positive(),
  snr: z.coerce.number().positive(),
  missingDataStrategy: z.enum(['mean', 'median', 'drop']),
  normalizationStrategy: z.enum(['minmax', 'zscore', 'none']),
  modelType: z.enum(['Random Forest', 'XGBoost', 'Neural Network']),
});

export type ExoDetectFormState = z.infer<typeof formSchema>;

export type ExoDetectResult = {
  featureEngineering: Awaited<ReturnType<typeof featureEngineeringPipeline>>;
  prediction: {
    class: 'Confirmed Exoplanet' | 'Planetary Candidate' | 'False Positive';
    confidence: number;
  };
  performance: {
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix: number[][];
  };
  explanation: Awaited<ReturnType<typeof explainablePredictions>>;
};

// A mock function to simulate model prediction
function mockPredict(
  engineeredFeatures: Record<string, number>
): ExoDetectResult['prediction'] {
  const score = Object.values(engineeredFeatures).reduce((a, b) => a + b, 0);
  const confidence = Math.min(0.99, Math.abs(Math.sin(score)) * 0.5 + 0.49);

  if (confidence > 0.85) {
    return { class: 'Confirmed Exoplanet', confidence };
  }
  if (confidence > 0.6) {
    return { class: 'Planetary Candidate', confidence };
  }
  return { class: 'False Positive', confidence };
}

// A mock function to simulate performance metrics
function mockPerformanceMetrics(): ExoDetectResult['performance'] {
  const precision = Math.random() * 0.1 + 0.88;
  const recall = Math.random() * 0.1 + 0.89;
  const f1Score = (2 * (precision * recall)) / (precision + recall);

  const truePositive = Math.floor(Math.random() * 20) + 80;
  const falsePositive = Math.floor(Math.random() * 5) + 2;
  const falseNegative = Math.floor(Math.random() * 5) + 1;
  const trueNegative = Math.floor(Math.random() * 10) + 90;

  return {
    precision,
    recall,
    f1Score,
    confusionMatrix: [
      [truePositive, falsePositive],
      [falseNegative, trueNegative],
    ],
  };
}

export async function runExoDetectPipeline(
  data: ExoDetectFormState
): Promise<ExoDetectResult> {
  const validatedData = formSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error('Invalid input data.');
  }

  const featureEngineeringInput: FeatureEngineeringInput = {
    orbitalPeriod: validatedData.data.orbitalPeriod,
    transitDuration: validatedData.data.transitDuration,
    planetaryRadius: validatedData.data.planetaryRadius,
    transitDepth: validatedData.data.transitDepth,
    snr: validatedData.data.snr,
    missingDataStrategy: validatedData.data.missingDataStrategy,
    normalizationStrategy: validatedData.data.normalizationStrategy,
  };

  const featureEngineeringResult = await featureEngineeringPipeline(
    featureEngineeringInput
  );

  const predictionResult = mockPredict(
    featureEngineeringResult.engineeredFeatures
  );
  const performanceMetrics = mockPerformanceMetrics();

  const explanationInput: ExplainablePredictionsInput = {
    prediction: predictionResult.class,
    features: featureEngineeringResult.engineeredFeatures,
    modelType: validatedData.data.modelType,
  };

  const explanationResult = await explainablePredictions(explanationInput);

  return {
    featureEngineering: featureEngineeringResult,
    prediction: predictionResult,
    performance: performanceMetrics,
    explanation: explanationResult,
  };
}
