import { Request } from "express";
import multer from "multer";
import AppError from "../utils/appError";

const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; //5MB

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "public/upload/image/users");
//   },

//   filename(req: IAuthenticatedRequest, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });

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
