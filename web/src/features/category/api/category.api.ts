import { api } from "@/lib/axios/client";
import type { CategoryQuery } from "../schema/category.request";
import type {
  FetchCategoriesRes,
  FetchCategoryRes,
} from "../types/category.types";

export const fetchCategories = async (params: CategoryQuery) => {
  const { data } = await api.get<FetchCategoriesRes>("/v1/categories", {
    params,
  });

  return data;
};

export const fetchCategory = async (categoryId: string) => {
  const { data } = await api.get<FetchCategoryRes>(
    `/v1/categories/${categoryId}`,
  );

  return data.data;
};
