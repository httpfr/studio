'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ExoDetectResult } from '@/app/actions';
import { Info } from 'lucide-react';

type ModelExplanationProps = {
  isLoading: boolean;
  result: ExoDetectResult | null;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-bold text-accent">
              {payload[0].value.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ModelExplanation({
  isLoading,
  result,
}: ModelExplanationProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const { explanation } = result;
  const chartData = Object.entries(explanation.explanation)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const title =
    explanation.explanationType === 'shap_values'
      ? 'SHAP Values'
      : 'Feature Importance';
  const description =
    explanation.explanationType === 'shap_values'
      ? 'Impact of each feature on this specific prediction.'
      : 'Overall importance of each feature for the model.';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                width={120}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--card))' }}
                content={<CustomTooltip />}
              />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                fill="hsl(var(--primary))"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-start gap-2 rounded-lg border bg-card p-3">
          <Info className="h-5 w-5 flex-shrink-0 text-accent" />
          <div className="flex-1">
            <p className="text-sm font-semibold">AI Rationale</p>
            <p className="text-sm text-muted-foreground">
              {explanation.rationale}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
