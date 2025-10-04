import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { ExoDetectResult } from '@/app/actions';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Star,
} from 'lucide-react';

const getStatus = (classification: string) => {
  switch (classification) {
    case 'Confirmed Exoplanet':
      return {
        icon: <CheckCircle2 className="text-green-500" />,
        color: 'text-green-500',
        description: 'High likelihood of being a valid exoplanet.',
      };
    case 'Planetary Candidate':
      return {
        icon: <HelpCircle className="text-yellow-500" />,
        color: 'text-yellow-500',
        description: 'Shows promising signs, requires further observation.',
      };
    case 'False Positive':
      return {
        icon: <AlertCircle className="text-red-500" />,
        color: 'text-red-500',
        description: 'Likely caused by stellar activity or instrumental noise.',
      };
    default:
      return {
        icon: <Star />,
        color: '',
        description: 'Awaiting classification.',
      };
  }
};

type PredictionResultProps = {
  isLoading: boolean;
  result: ExoDetectResult | null;
};

export function PredictionResult({ isLoading, result }: PredictionResultProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const { prediction } = result;
  const status = getStatus(prediction.class);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Result</CardTitle>
        <CardDescription>
          AI-powered classification of the celestial object.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{status.icon}</div>
          <div>
            <p className={`text-2xl font-bold ${status.color}`}>
              {prediction.class}
            </p>
            <p className="text-sm text-muted-foreground">
              {status.description}
            </p>
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between">
            <span className="text-sm font-medium">Confidence Score</span>
            <span className="text-sm font-bold text-accent">
              {(prediction.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <Progress value={prediction.confidence * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
