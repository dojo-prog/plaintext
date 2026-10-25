import { z } from "zod";

import { AuthorSchema } from "@/features/auth/schema";

// =======================================
// Entity
// =======================================

export const CommentSchema = z.object({
  id: z.uuid(),
  post_id: z.uuid(),

  user: AuthorSchema.optional(),

  content: z.string(),

  created_at: z.string(),
  updated_at: z.string(),
});

// =======================================
// Types
// =======================================

export type Comment = z.infer<typeof CommentSchema>;
