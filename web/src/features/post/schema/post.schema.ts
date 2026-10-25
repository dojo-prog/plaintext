import { z } from "zod";

import { AuthorSchema } from "@/features/auth/schema";
import { CategorySchema } from "@/features/category/schema";

const POST_IMAGE_MAX_SIZE = 5 * 1024 * 1024;

// =======================================
// Enum
// =======================================

export const PostStatusSchema = z.enum(["draft", "published"]);

// =======================================
// Entity
// =======================================

export const PostSchema = z.object({
  id: z.uuid(),

  author: AuthorSchema.optional(),
  category: CategorySchema.optional(),

  title: z.string(),
  slug: z.string(),
  content: z.string(),
  image: z.string().nullable(),
  image_url: z.string().nullable(),
  status: PostStatusSchema,
  likes_count: z.number().optional(),
  published_at: z.string().nullable(),

  created_at: z.string(),
  updated_at: z.string(),
});

export const PostImageSchema = z
  .file({ message: "Post image is required" })
  .mime(["image/jpeg", "image/png", "image/webp"], {
    message: "Post image must be a file of type: jpg, jpeg, png, webp",
  })
  .max(POST_IMAGE_MAX_SIZE, {
    message: "Post image cannot exceed 5MB",
  });

// =======================================
// Types
// =======================================

export type Post = z.infer<typeof PostSchema>;

export type PostImage = z.infer<typeof PostImageSchema>;
