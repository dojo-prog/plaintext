import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type { Comment } from "../schema";

// =======================================
// Response shape
// =======================================

export type FetchPostCommentsRes = PaginatedResponse<Comment[]>;

export type CreateCommentRes = ApiResponse<Comment>;

export type UpdateCommentRes = ApiResponse<Comment>;
