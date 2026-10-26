import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type { Category } from "../schema";

// =======================================
// Response shape
// =======================================

export type FetchCategoriesRes = PaginatedResponse<Category[]>;

export type FetchCategoryRes = ApiResponse<Category>;
