import { useParams } from "react-router-dom";
import ErrorState from "@/components/shared/ErrorState";
import PostDetailSkeleton from "@/features/post/components/PostDetailSkeleton";
import PostForm from "@/features/post/components/PostForm";
import { usePost } from "@/features/post/hooks/usePost";

const EditPostPage = () => {
  const { postId } = useParams();
  const postQuery = usePost(postId ?? "");

  if (!postId) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState title="Post not found" description="The post link is invalid." />
      </div>
    );
  }

  if (postQuery.isPending) {
    return <PostDetailSkeleton />;
  }

  if (!postQuery.data) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          title="Could not load this post"
          description="You may not have permission to edit this post, or it may no longer exist."
          onRetry={() => void postQuery.refetch()}
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <PostForm key={postQuery.data.id} initialPost={postQuery.data} />
    </div>
  );
};

export default EditPostPage;
