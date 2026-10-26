import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "../api/post.api";

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ["posts", postId],
    queryFn: () => fetchPost(postId),
  });
};
