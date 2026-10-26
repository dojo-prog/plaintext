import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPostComments } from "../api/comment.api";

export const usePostComments = (postId: string) => {
  return useInfiniteQuery({
    queryKey: ["post-comments", postId],
    queryFn: ({ pageParam }) => fetchPostComments(postId, pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;

      return current_page < last_page ? current_page + 1 : undefined;
    },
  });
};
