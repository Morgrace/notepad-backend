import Note from "../../models/noteModel";
import { IAuthenticatedRequest } from "../../types";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";

export const restrictToOwnerOrAdmin = catchAsync(
  async (req: IAuthenticatedRequest, res, next) => {
    const note = await Note.findById(req.params.id);

    if (!note) return next(new AppError("Note not found", 404));

    if (!note.createdByUser(String(req.user?._id), req.user?.role || "user"))
      return next(new AppError("Not authorized", 403));

    next();
  }
);
