import type { ApiResponse } from "@/types/api.types";
import type { User } from "../schema";

// =======================================
// Response Shape
// =======================================

export type FetchCurrentUserRes = ApiResponse<User>;

export type LoginRes = ApiResponse<{ user: User; token: string }>;
