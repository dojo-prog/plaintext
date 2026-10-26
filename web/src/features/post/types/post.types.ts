import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type { Post } from "../schema";

// =======================================
// Response shape
// =======================================

export type FetchPostsRes = PaginatedResponse<Post[]>;

export type FetchPostRes = ApiResponse<Post>;

export type CreatePostRes = ApiResponse<Post>;

export type UpdatePostRes = ApiResponse<Post>;

export type PublishPostRes = ApiResponse<Post>;

export type DraftPostRes = ApiResponse<Post>;
