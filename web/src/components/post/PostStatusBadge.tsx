import { Badge } from "@/components/ui/badge";
import type { Post } from "@/features/post/schema";

type PostStatusBadgeProps = {
  status: Post["status"];
};

const PostStatusBadge = ({ status }: PostStatusBadgeProps) => {
  return (
    <Badge variant={status === "published" ? "default" : "secondary"}>
      {status === "published" ? "Published" : "Draft"}
    </Badge>
  );
};

export default PostStatusBadge;
