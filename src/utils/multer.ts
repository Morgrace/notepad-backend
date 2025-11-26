import multer from "multer";
import { Request } from "express";
import { IAuthenticatedRequest } from "../types";

import AppError from "./appError";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/upload/image/users");
  },

  filename(req: IAuthenticatedRequest, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
  },
});

const fileFiler = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 400));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFiler,
  limits: {
    fileSize: 1024 * 1024 * 5, // limit file size to 5mb
  },
});
