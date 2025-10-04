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
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ExoDetectResult } from '@/app/actions';
import { useMemo } from 'react';

// Generate data for a light curve
const generateLightCurveData = () => {
  const data = [];
  const totalPoints = 100;
  const transitStart = 40;
  const transitEnd = 60;
  const transitDepth = 0.05; // 5% drop

  for (let i = 0; i <= totalPoints; i++) {
    let brightness = 1.0;
    if (i >= transitStart && i <= transitEnd) {
      // Simple parabolic dip
      const midPoint = (transitStart + transitEnd) / 2;
      const dip = Math.pow((i - midPoint) / (midPoint - transitStart), 2);
      brightness = 1.0 - transitDepth * (1 - dip);
    }
    // Add some noise
    brightness += (Math.random() - 0.5) * 0.005;

    data.push({ time: i, brightness: parseFloat(brightness.toFixed(4)) });
  }
  return data;
};

type TransitSimulationProps = {
  isLoading: boolean;
  result: ExoDetectResult | null;
};

export function TransitSimulation({
  isLoading,
  result,
}: TransitSimulationProps) {
  const lightCurveData = useMemo(() => generateLightCurveData(), []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[125px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transit Simulation</CardTitle>
        <CardDescription>
          Simulated light curve showing brightness drop.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[125px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={lightCurveData}
              margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorBrightness" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--accent))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--accent))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                label={{
                  value: 'Time',
                  position: 'insideBottom',
                  offset: -5,
                  fill: 'hsl(var(--muted-foreground))',
                }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0.94, 1.01]}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--accent))', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="brightness"
                stroke="hsl(var(--accent))"
                fill="url(#colorBrightness)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
