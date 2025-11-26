import { NextFunction, Response } from "express";
import { IAuthenticatedRequest } from "../types";
import AppError from "../utils/appError";

export const restrictToAdmin = function (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(
      new AppError("You must be logged in to access this resource", 401)
    );
  }

  if (req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  next();
};
