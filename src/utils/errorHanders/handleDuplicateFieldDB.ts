import { IAppError } from "../../types";
import AppError from "../appError";

export const handleDuplicateFieldsDB = (err: IAppError) => {
  let value = "";
  let field = "";

  // Extract field and value
  if (err.keyValue) {
    const duplicateField = Object.keys(err.keyValue)[0];
    field = duplicateField;
    value = err.keyValue[duplicateField];
  } else {
    // Fallback: parse the error message for the duplicate value
    const dupKeyMatch = err.errmsg?.match(
      /dup key:\s*{\s*([^:]+):\s*"([^"]+)"\s*}/
    );

    if (dupKeyMatch) {
      field = dupKeyMatch[1].trim();
      value = dupKeyMatch[2];
    } else {
      // Final fallback: try to extract any quoted value from the error message
      const quotedMatch = err.errmsg?.match(/"([^"]+)"/);
      if (quotedMatch) {
        value = quotedMatch[1];
      }
    }
  }

  // Field-specific user-friendly messages
  const fieldMessages: Record<string, string> = {
    email: `The email address '${value}' is already registered. Please log in or use a different email.`,
    username: `The username '${value}' is already taken. Please choose a different username.`,
    phone: `This phone number is already registered. Please use a different number.`,
    slug: `This URL is already in use. Please choose a different one.`,
  };

  // Use field-specific message if available, otherwise generic
  const message =
    fieldMessages[field] ||
    `A duplicate value was detected${field ? ` for ${field}` : ""}${
      value ? `: '${value}'` : ""
    }. Please use a different value.`;

  return new AppError(message, 400);
};
