import { CalendarDays, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Post } from "@/features/post/schema";
import PostStatusBadge from "./PostStatusBadge";

type PostCardProps = {
  post: Post;
};

const formatPostDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
};

const PostCard = ({ post }: PostCardProps) => {
  const excerpt =
    post.content.length > 180
      ? `${post.content.slice(0, 180).trimEnd()}...`
      : post.content;
  const postDate = formatPostDate(post.published_at ?? post.created_at);

  return (
    <Link
      to={`/posts/${post.id}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`Read post: ${post.title}`}
    >
      <Card className="h-full transition-shadow group-hover:shadow-md">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt=""
            className="aspect-video w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="flex aspect-video w-full items-center justify-center bg-muted text-sm text-muted-foreground"
            aria-hidden="true"
          >
            No image
          </div>
        )}

        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {post.category && (
              <Badge variant="outline">{post.category.name}</Badge>
            )}
            <PostStatusBadge status={post.status} />
          </div>
          <CardTitle className="line-clamp-2 text-lg transition-colors group-hover:text-primary">
            {post.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 min-h-15">
            {excerpt}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="min-w-0 truncate">
            {post.author?.name ?? "Unknown author"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="size-3.5" aria-hidden="true" />
            <span>{(post.likes_count ?? 0).toLocaleString()}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <time dateTime={post.published_at ?? post.created_at}>
              {postDate}
            </time>
          </span>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PostCard;
