import { Skeleton } from "@/components/ui/skeleton";

type LoadingGridProps = {
  count?: number;
};

const LoadingGrid = ({ count = 6 }: LoadingGridProps) => {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Loading posts"
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl ring-1 ring-foreground/10"
        >
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="space-y-4 p-4">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingGrid;
