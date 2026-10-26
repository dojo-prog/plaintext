import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import LoadingGrid from "@/components/post/LoadingGrid";
import PostCard from "@/components/post/PostCard";
import { useUserLikedPosts } from "@/features/like/hooks/useUserLikedPosts";

const UserLikedPostsPage = () => {
  const likedPosts = useUserLikedPosts();
  const posts = likedPosts.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">Your collection</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Liked posts</h1>
        <p className="mt-2 text-muted-foreground">
          Posts you have liked from the Dojo community.
        </p>
      </header>

      {likedPosts.isPending ? (
        <LoadingGrid />
      ) : (
        <>
          {likedPosts.isError && (
            <ErrorState
              title={
                posts.length > 0
                  ? "Could not refresh your liked posts"
                  : "Could not load your liked posts"
              }
              description="Your liked posts are unavailable right now. Please try again."
              onRetry={() => void likedPosts.refetch()}
            />
          )}

          {!likedPosts.isError && posts.length === 0 && (
            <EmptyState
              title="No liked posts yet"
              description="When you like a post, you can find it here."
            />
          )}

          {posts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {likedPosts.hasNextPage && (
            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => void likedPosts.fetchNextPage()}
                disabled={likedPosts.isFetchingNextPage}
              >
                {likedPosts.isFetchingNextPage
                  ? "Loading posts..."
                  : "Load more posts"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserLikedPostsPage;
