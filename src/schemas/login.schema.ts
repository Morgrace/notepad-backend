import z from "zod";

export const loginSchema = z.object({
  email: z.email("Please provide a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(50, "Password too long"),
});

export type Login = z.infer<typeof loginSchema>;
