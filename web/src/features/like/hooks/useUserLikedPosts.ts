import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUserLikedPosts } from "../api/like.api";

export const useUserLikedPosts = () => {
  return useInfiniteQuery({
    queryKey: ["current-user-liked-posts"],
    queryFn: ({ pageParam }) => fetchUserLikedPosts(pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;

      return current_page < last_page ? current_page + 1 : undefined;
    },
  });
};
