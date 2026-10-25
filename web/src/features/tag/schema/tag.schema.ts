import { z } from "zod";

// =======================================
// Entity
// =======================================

export const TagSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// =======================================
// Types
// =======================================

export type Tag = z.infer<typeof TagSchema>;
