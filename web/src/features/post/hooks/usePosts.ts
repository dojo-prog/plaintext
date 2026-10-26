import { useInfiniteQuery } from "@tanstack/react-query";
import type { PostQuery } from "../schema";
import { fetchPosts } from "../api/post.api";

export const usePosts = (params: PostQuery) => {
  return useInfiniteQuery({
    queryKey: ["posts", params],
    queryFn: ({ pageParam }) => fetchPosts({ ...params, page: pageParam }),

    initialPageParam: params.page,

    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;

      return current_page < last_page ? current_page + 1 : undefined;
    },
  });
};
