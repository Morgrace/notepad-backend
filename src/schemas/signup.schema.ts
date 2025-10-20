import z from "zod";

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .toLowerCase()
      .min(2, "First name is required")
      .max(50, "First name too long"),
    lastName: z
      .string()
      .trim()
      .toLowerCase()
      .min(2, "Last name is required")
      .max(50, "Last name too long"),
    email: z.email(),
    password: z
      .string()
      .min(8, "Password should be at least 8 characters")
      .max(30, "Password too long"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export type Signup = z.infer<typeof signupSchema>;
