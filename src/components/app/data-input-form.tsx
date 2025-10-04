'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { runExoDetectPipeline, type ExoDetectResult } from '@/app/actions';
import { Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  orbitalPeriod: z.coerce.number().min(0.01, 'Must be positive'),
  transitDuration: z.coerce.number().min(0.01, 'Must be positive'),
  planetaryRadius: z.coerce.number().min(0.01, 'Must be positive'),
  transitDepth: z.coerce.number().min(0.01, 'Must be positive'),
  snr: z.coerce.number().min(0.01, 'Must be positive'),
  missingDataStrategy: z.enum(['mean', 'median', 'drop']),
  normalizationStrategy: z.enum(['minmax', 'zscore', 'none']),
  modelType: z.enum(['Random Forest', 'XGBoost', 'Neural Network']),
});

type DataInputFormProps = {
  onResult: (data: ExoDetectResult) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string | null) => void;
  isProcessing: boolean;
};

export function DataInputForm({
  onResult,
  onLoading,
  onError,
  isProcessing,
}: DataInputFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orbitalPeriod: 11.8,
      transitDuration: 0.1,
      planetaryRadius: 0.8,
      transitDepth: 689.0,
      snr: 45.8,
      missingDataStrategy: 'mean',
      normalizationStrategy: 'minmax',
      modelType: 'Random Forest',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onLoading(true);
    onError(null);
    try {
      const result = await runExoDetectPipeline(values);
      onResult(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      onError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: errorMessage,
      });
    } finally {
      onLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="border-dashed border-2 border-border rounded-lg p-4 text-center cursor-pointer hover:border-accent">
            <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-accent">Upload a CSV</span> or
              enter data manually.
            </p>
            <Input id="csv-upload" type="file" className="sr-only" />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Sample values are pre-filled.
          </p>

          <Separator />

          <h4 className="font-semibold">Planetary Parameters</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="orbitalPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orbital Period (days)</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transitDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transit Duration (hrs)</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="planetaryRadius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planetary Radius (R⊕)</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transitDepth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transit Depth (ppm)</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="snr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signal-to-Noise Ratio</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <h4 className="font-semibold">AI Configuration</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="modelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classification Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Random Forest">Random Forest</SelectItem>
                      <SelectItem value="XGBoost">XGBoost</SelectItem>
                      <SelectItem value="Neural Network">
                        Neural Network
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="missingDataStrategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Missing Data Strategy</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mean">Mean</SelectItem>
                      <SelectItem value="median">Median</SelectItem>
                      <SelectItem value="drop">Drop</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="normalizationStrategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Normalization Strategy</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="minmax">Min-Max</SelectItem>
                      <SelectItem value="zscore">Z-Score</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isProcessing ? 'Analyzing...' : 'Run Discovery'}
        </Button>
      </form>
    </Form>
  );
}
