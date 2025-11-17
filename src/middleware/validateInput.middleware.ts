import catchAsync from "../utils/catchAsync";
import z from "zod";

export const validate = <T>(schema: z.ZodSchema<T>) =>
  catchAsync(async (req, res, next) => {
    const validateInput = schema.parse(req.body);

    //reasign sanitized values to req.body
    req.body = validateInput;
    next();
  });
