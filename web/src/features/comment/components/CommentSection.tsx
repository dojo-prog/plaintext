import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostComments } from "@/features/comment/hooks/usePostComments";
import type { User } from "@/features/auth/schema";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

type CommentSectionProps = {
  postId: string;
  currentUser?: User;
  isCurrentUserPending?: boolean;
};

const CommentSection = ({
  postId,
  currentUser,
  isCurrentUserPending = false,
}: CommentSectionProps) => {
  const commentsQuery = usePostComments(postId);
  const comments = commentsQuery.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <section aria-labelledby="comments-heading" className="space-y-6">
      <div>
        <h2 id="comments-heading" className="text-2xl font-bold tracking-tight">
          Discussion
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Join the conversation with the community.
        </p>
      </div>

      <CommentForm
        postId={postId}
        user={currentUser}
        isUserPending={isCurrentUserPending}
      />

      {commentsQuery.isPending ? (
        <div className="space-y-4" role="status" aria-label="Loading comments">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="space-y-3 rounded-xl border p-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : commentsQuery.isError && comments.length === 0 ? (
        <ErrorState
          title="Could not load comments"
          onRetry={() => void commentsQuery.refetch()}
        />
      ) : comments.length === 0 ? (
        <EmptyState
          title="No comments yet"
          description="Be the first to share your thoughts."
        />
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}

      {commentsQuery.hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => void commentsQuery.fetchNextPage()}
            disabled={commentsQuery.isFetchingNextPage}
          >
            {commentsQuery.isFetchingNextPage
              ? "Loading comments..."
              : "Load more comments"}
          </Button>
        </div>
      )}

      {commentsQuery.isFetchNextPageError && (
        <ErrorState
          title="Could not load more comments"
          description="The comments already loaded are still available."
          retryLabel="Retry"
          onRetry={() => void commentsQuery.fetchNextPage()}
        />
      )}
    </section>
  );
};

export default CommentSection;
