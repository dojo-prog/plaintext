import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import type { User } from "@/features/auth/schema";
import { useToggleLike } from "@/features/like/hooks/useToggleLike";
import type { Post } from "@/features/post/schema";

type PostLikeButtonProps = {
  post: Post;
  currentUser?: User;
  isCurrentUserPending: boolean;
};

const PostLikeButton = ({
  post,
  currentUser,
  isCurrentUserPending,
}: PostLikeButtonProps) => {
  const toggleLike = useToggleLike();

  if (isCurrentUserPending) {
    return (
      <Button type="button" variant="outline" disabled>
        <Heart aria-hidden="true" />
        Loading account...
      </Button>
    );
  }

  if (!currentUser) {
    return (
      <Link to="/auth" className={buttonVariants({ variant: "outline" })}>
        <Heart aria-hidden="true" />
        Sign in to like
        <span>{post.likes_count ?? 0}</span>
      </Link>
    );
  }

  return (
    <Button
      type="button"
      variant={post.is_liked ? "default" : "outline"}
      onClick={() => toggleLike.mutate(post.id)}
      disabled={toggleLike.isPending}
      aria-pressed={post.is_liked ?? false}
    >
      <Heart
        aria-hidden="true"
        className={post.is_liked ? "fill-current" : undefined}
      />
      {toggleLike.isPending
        ? "Updating..."
        : post.is_liked
          ? "Liked"
          : "Like"}
      <span aria-label={`${post.likes_count ?? 0} likes`}>
        {post.likes_count ?? 0}
      </span>
    </Button>
  );
};

export default PostLikeButton;
