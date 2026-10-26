import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { CategoryQuery } from "../schema/category.request";
import { fetchCategories } from "../api/category.api";

export const useCategories = (params: CategoryQuery) => {
  return useInfiniteQuery({
    queryKey: ["categories", params],
    queryFn: ({ pageParam }) => fetchCategories({ page: pageParam }),

    initialPageParam: params.page,

    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;

      return current_page < last_page ? current_page + 1 : undefined;
    },

    placeholderData: keepPreviousData,
  });
};
