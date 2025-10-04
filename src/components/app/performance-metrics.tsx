import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import type { ExoDetectResult } from '@/app/actions';

type PerformanceMetricsProps = {
  isLoading: boolean;
  result: ExoDetectResult | null;
};

const MetricCard = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export function PerformanceMetrics({
  isLoading,
  result,
}: PerformanceMetricsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const { performance } = result;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance</CardTitle>
        <CardDescription>
          Metrics based on historical test data for the selected model.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Precision"
            value={performance.precision.toFixed(3)}
          />
          <MetricCard title="Recall" value={performance.recall.toFixed(3)} />
          <MetricCard title="F1-Score" value={performance.f1Score.toFixed(3)} />
        </div>
        <div>
          <h4 className="font-medium mb-2">Confusion Matrix</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-center">Predicted Planet</TableHead>
                <TableHead className="text-center">
                  Predicted Not Planet
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableHead className="font-bold">Actual Planet</TableHead>
                <TableCell className="text-center text-green-500 font-medium">
                  {performance.confusionMatrix[0][0]}
                </TableCell>
                <TableCell className="text-center">
                  {performance.confusionMatrix[0][1]}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-bold">Actual Not Planet</TableHead>
                <TableCell className="text-center">
                  {performance.confusionMatrix[1][0]}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {performance.confusionMatrix[1][1]}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
