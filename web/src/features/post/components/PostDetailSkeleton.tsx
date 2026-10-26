import { Skeleton } from "@/components/ui/skeleton";

const PostDetailSkeleton = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-5">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-12 w-4/5" />
        <Skeleton className="h-5 w-56" />
      </div>
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </div>
    </div>
  );
};

export default PostDetailSkeleton;
