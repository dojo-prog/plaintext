import { PaginationQuerySchema } from "@/schema/common";
import { z } from "zod";

// =======================================
// Query
// =======================================

export const CategoryQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
});

// =======================================
// Types
// =======================================

export type CategoryQuery = z.infer<typeof CategoryQuerySchema>;
