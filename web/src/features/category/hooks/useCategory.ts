import { useQuery } from "@tanstack/react-query";
import { fetchCategory } from "../api/category.api";

export const useCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => fetchCategory(categoryId),
  });
};
