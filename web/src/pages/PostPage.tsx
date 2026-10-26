import { useParams } from "react-router-dom";
import ErrorState from "@/components/shared/ErrorState";
import CommentSection from "@/features/comment/components/CommentSection";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import PostArticle from "@/features/post/components/PostArticle";
import PostDetailSkeleton from "@/features/post/components/PostDetailSkeleton";
import { usePost } from "@/features/post/hooks/usePost";

const PostPage = () => {
  const { postId } = useParams();
  const postQuery = usePost(postId ?? "");
  const { data: currentUser, isPending: isCurrentUserPending } =
    useCurrentUser();
  const post = postQuery.data;

  if (!postId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          title="Post not found"
          description="The post link is invalid."
        />
      </div>
    );
  }

  if (postQuery.isPending) {
    return <PostDetailSkeleton />;
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          title="Could not load this post"
          description="The post may have been removed or is temporarily unavailable."
          onRetry={() => void postQuery.refetch()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <PostArticle
        post={post}
        currentUser={currentUser}
        isCurrentUserPending={isCurrentUserPending}
      />
      <div className="mx-auto mt-12 max-w-3xl">
        <CommentSection
          postId={post.id}
          currentUser={currentUser}
          isCurrentUserPending={isCurrentUserPending}
        />
      </div>
    </div>
  );
};

export default PostPage;
