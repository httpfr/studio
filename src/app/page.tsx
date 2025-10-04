'use client';

import { useState } from 'react';
import type { ExoDetectResult } from '@/app/actions';
import { Header } from '@/components/app/header';
import { DataInputForm } from '@/components/app/data-input-form';
import { PredictionResult } from '@/components/app/prediction-result';
import { TransitSimulation } from '@/components/app/transit-simulation';
import { ModelExplanation } from '@/components/app/model-explanation';
import { PerformanceMetrics } from '@/components/app/performance-metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState<ExoDetectResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = (data: ExoDetectResult) => {
    setResult(data);
    setError(null);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setError(null);
      setResult(null);
    }
  };

  const handleError = (error: string | null) => {
    setError(error);
    setIsLoading(false);
    setResult(null);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Exoplanet Data Input</CardTitle>
            </CardHeader>
            <CardContent>
              <DataInputForm
                onResult={handleFormSubmit}
                onLoading={handleLoadingChange}
                onError={handleError}
                isProcessing={isLoading}
              />
            </CardContent>
          </Card>
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <PredictionResult isLoading={isLoading} result={result} />
              <TransitSimulation isLoading={isLoading} result={result} />
            </div>
            <ModelExplanation isLoading={isLoading} result={result} />
            <PerformanceMetrics isLoading={isLoading} result={result} />

            {!isLoading && !result && !error && (
              <Card className="col-span-full flex flex-col items-center justify-center py-16">
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                  <div className="rounded-full border border-dashed p-4">
                    <Rocket className="size-12 text-muted-foreground" />
                  </div>
                  <h3 className="font-headline text-2xl font-bold tracking-tight">
                    Ready for Discovery
                  </h3>
                  <p className="text-muted-foreground">
                    Enter exoplanet data to begin the analysis.
                  </p>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="col-span-full bg-destructive/10">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Analysis Failed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-destructive-foreground">{error}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
