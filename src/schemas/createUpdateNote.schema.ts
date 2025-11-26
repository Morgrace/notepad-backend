import z from "zod";

export const createUpdateNoteSchema = z
  .object({
    title: z.string().max(200).optional(),
    content: z.string().max(5000).optional(),
  })
  .strict();
