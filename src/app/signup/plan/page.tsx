
import { Suspense } from 'react';
import { PlanSelection } from '@/components/signup/plan-selection';
import { Skeleton } from '@/components/ui/skeleton';

function PlanSelectionSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <Skeleton className="h-10 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    <Skeleton className="h-96 rounded-lg" />
                    <Skeleton className="h-96 rounded-lg" />
                    <Skeleton className="h-96 rounded-lg" />
                </div>
                 <div className="mt-8 flex justify-center">
                    <Skeleton className="h-12 w-48" />
                </div>
            </div>
        </div>
    );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<PlanSelectionSkeleton />}>
      <PlanSelection />
    </Suspense>
  );
}
