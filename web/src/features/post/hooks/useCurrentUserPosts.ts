import { useInfiniteQuery } from "@tanstack/react-query";
import type { PostQuery } from "../schema";
import { fetchUserPosts } from "../api/post.api";

export const useCurrentUserPosts = (params: PostQuery) => {
  return useInfiniteQuery({
    queryKey: ["current-user-posts", params],
    queryFn: ({ pageParam }) => fetchUserPosts({ ...params, page: pageParam }),

    initialPageParam: params.page,

    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;

      return current_page < last_page ? current_page + 1 : undefined;
    },
  });
};
