import { z } from "zod";

// =======================================
// Query
// =======================================

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().nonnegative().default(1),
});
