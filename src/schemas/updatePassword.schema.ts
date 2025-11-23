import z from "zod";

export const updatePasswordSchema = z
  .object({
    passwordCurrent: z.string().min(1, "Please input current password"),
    password: z.string().min(8, "Password should be at least 8 characters"),
    passwordConfirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: "Password mismatch",
    path: ["passwordConfirm"],
  });
