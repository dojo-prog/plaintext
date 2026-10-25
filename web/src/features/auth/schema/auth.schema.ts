import { z } from "zod";

// =======================================
// Entity
// =======================================

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  username: z.string().nullable(),
  email: z.email(),
  role: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AuthorSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  username: z.string().nullable(),
});

// =======================================
// Types
// =======================================

export type Author = z.infer<typeof AuthorSchema>;

export type User = z.infer<typeof UserSchema>;
