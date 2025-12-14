import { Request } from "express";
import multer from "multer";
import AppError from "../utils/appError";

const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; //5MB

const fileFiler = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // console.log(file.mimetype);
  if (ALLOWED_FORMATS.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Invalid file type. Only JPEG, PNG and WebP allowed", 400));
  }
};

export const upload = multer({
  //   storage: storage,
  storage: multer.memoryStorage(),
  fileFilter: fileFiler,
  limits: {
    fileSize: MAX_SIZE, // limit file size to 5mb
  },
});
