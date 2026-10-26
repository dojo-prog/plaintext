import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import LoadingGrid from "@/components/post/LoadingGrid";
import PostCard from "@/components/post/PostCard";
import type { Post } from "@/features/post/schema";

type HomePostFeedProps = {
  posts: Post[];
  isPending: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isNextPageError: boolean;
  emptyDescription: string;
  onRetry: () => void;
  onFetchNextPage: () => void;
};

const HomePostFeed = ({
  posts,
  isPending,
  isError,
  isFetchingNextPage,
  hasNextPage,
  isNextPageError,
  emptyDescription,
  onRetry,
  onFetchNextPage,
}: HomePostFeedProps) => {
  if (isPending) {
    return <LoadingGrid />;
  }

  if (isError && posts.length === 0) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No published posts found"
        description={emptyDescription}
      />
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasNextPage && (
        <div className="mt-10 flex justify-center">
          <Button
            onClick={onFetchNextPage}
            disabled={isFetchingNextPage}
            variant="outline"
            size="lg"
          >
            {isFetchingNextPage ? "Loading posts..." : "Load more"}
          </Button>
        </div>
      )}

      {isNextPageError && (
        <ErrorState
          title="Could not load more posts"
          description="Your current posts are still available. Please try loading the next page again."
          retryLabel="Retry"
          onRetry={onFetchNextPage}
        />
      )}
    </>
  );
};

export default HomePostFeed;
