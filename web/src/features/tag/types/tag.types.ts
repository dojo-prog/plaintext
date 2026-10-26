import type { ApiResponse } from "@/types/api.types";
import type { Tag } from "../schema/tag.schema";

// =======================================
// Reponse shape
// =======================================

export type FetchTagsRes = ApiResponse<Tag[]>;

export type FetchTagRes = ApiResponse<Tag>;
