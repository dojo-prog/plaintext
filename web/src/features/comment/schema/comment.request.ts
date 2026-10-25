import { z } from "zod";

// =======================================
// Request Body
// =======================================

export const CreateCommentSchema = z.object({
  content: z
    .string({ message: "Comment content must be a valid string" })
    .min(1, { message: "Comment content is required" })
    .max(240, { message: "Comment cannot exceed 240 characters" }),
});

export const UpdateCommentSchema = CreateCommentSchema.partial();

// =======================================
// Types
// =======================================

export type CreateCommentBody = z.infer<typeof CreateCommentSchema>;

export type UpdateCommentBody = z.infer<typeof UpdateCommentSchema>;
