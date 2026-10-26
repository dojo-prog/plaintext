import { CalendarDays, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/features/auth/schema";
import type { Post } from "@/features/post/schema";
import PostLikeButton from "./PostLikeButton";

type PostArticleProps = {
  post: Post;
  currentUser?: User;
  isCurrentUserPending: boolean;
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(date);
};

const PostArticle = ({
  post,
  currentUser,
  isCurrentUserPending,
}: PostArticleProps) => {
  const publishedDate = post.published_at ?? post.created_at;

  return (
    <article>
      <header className="mx-auto max-w-3xl">
        {post.category && (
          <Link to={`/?category=${encodeURIComponent(post.category.slug)}`}>
            <Badge variant="outline">{post.category.name}</Badge>
          </Link>
        )}
        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <UserRound className="size-4" aria-hidden="true" />
            {post.author?.name ?? "Unknown author"}
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4" aria-hidden="true" />
            <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
          </span>
        </div>
      </header>

      {post.image_url && (
        <img
          src={post.image_url}
          alt=""
          className="mt-8 max-h-[32rem] w-full rounded-2xl object-cover"
        />
      )}

      <div className="mx-auto mt-10 max-w-3xl">
        <div className="whitespace-pre-wrap break-words text-base leading-8 sm:text-lg">
          {post.content}
        </div>

        <div className="mt-8 flex items-center border-y py-4">
          <PostLikeButton
            post={post}
            currentUser={currentUser}
            isCurrentUserPending={isCurrentUserPending}
          />
        </div>
      </div>
    </article>
  );
};

export default PostArticle;
