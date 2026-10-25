import { z } from "zod";

// =======================================
// Request Query
// =======================================

export const PostStatusQuerySchema = z.object({
  status: z
    .enum(["draft", "published"], { message: "Invalid post status on query" })
    .optional(),
});

// =======================================
// Request Body
// =======================================

export const CreatePostSchema = z.object({
  category_id: z
    .uuid({ message: "The selected category is invalid" })
    .optional(),

  title: z
    .string({ message: "Post title must be a valid string" })
    .min(2, { message: "Post title must be at least 2 characters long" })
    .max(200, { message: "Post title cannot exceed 200 characters" }),

  content: z
    .string({ message: "Post content must be a valid string" })
    .min(10, { message: "Post content must be at least 10 characters long" })
    .max(2000, { message: "Post content cannot exceed 2000 characters" }),

  status: z
    .enum(["draft", "published"], {
      message: "Post status must be one of the following: draft, published",
    })
    .optional(),
});

export const UpdatePostSchema = CreatePostSchema.partial().extend({
  category_id: z
    .uuid({ message: "The selected category is invalid" })
    .nullable()
    .optional(),
});

// =======================================
// Types
// =======================================

export type CreatePostBody = z.infer<typeof CreatePostSchema>;

export type UpdatePostBody = z.infer<typeof UpdatePostSchema>;
