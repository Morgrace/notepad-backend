import z from "zod";
export const updateMeSchema = z.preprocess(
  (data) => {
    if (typeof data !== "object" || data === null) return data;

    const cleaned: Record<string, any> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== "") cleaned[key] = value;
    });
    return cleaned;
  },
  z.object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(100, "first name is too long")
      .trim()
      .transform((val) => val.toLowerCase())
      .optional(),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(100, "Last name is too long")
      .trim()
      .transform((val) => val.toLowerCase())
      .optional(),
  })
);
