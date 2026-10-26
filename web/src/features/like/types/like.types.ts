import type { Post } from "@/features/post/schema";
import type { PaginatedResponse } from "@/types/api.types";

// =======================================
// Response shape
// =======================================

export type FetchUserLikedPostRes = PaginatedResponse<Post[]>;
