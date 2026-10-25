// =======================================
// Entity
// =======================================

import { z } from "zod";

export const CategorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// =======================================
// Types
// =======================================

export type Category = z.infer<typeof CategorySchema>;
