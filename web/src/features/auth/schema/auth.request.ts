import { z } from "zod";

export const PasswordSchema = z
  .string({ message: "Password must be a valid string" })
  .min(8, { message: "Password must at least be 8 characters long " });

// =======================================
// Reusable Fields
// =======================================

export const EmailSchema = z
  .string({ message: "Email must be a valid string" })
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email format" })
  .toLowerCase();

// =======================================
// Request Body
// =======================================

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const RegisterSchema = z
  .object({
    name: z
      .string({ message: "Name must be a valid string" })
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(255, { message: "Name cannot exceed 255 characters" }),

    username: z
      .string({ message: "Username must be a valid string" })
      .max(255, { message: "Username cannot exceed 255 characters" })
      .optional(),

    email: z
      .string({ message: "Email must be a valid string" })
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email format" })
      .max(255, { message: "Email cannot exceed 255 characters" })
      .toLowerCase(),

    password: PasswordSchema,

    password_confirmation: z
      .string({ message: "Password confirmation must be a valid string" })
      .min(1, { message: "Password confirmation is required" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password confirmation does not match",
    path: ["password_confirmation"],
  });

/// =======================================
// Types
// =======================================

export type LoginBody = z.infer<typeof LoginSchema>;

export type RegisterBody = z.infer<typeof RegisterSchema>;
