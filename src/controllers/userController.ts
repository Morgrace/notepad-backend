import Note from "../models/noteModel";
import { IAuthenticatedRequest } from "../types";
import catchAsync from "../utils/catchAsync";

export const getUser = catchAsync(
  async (req: IAuthenticatedRequest, res, next) => {
    res.status(200).json({
      status: "success",
      data: { user: req.user },
    });
  }
);
export const getUserNotes = catchAsync(
  async (req: IAuthenticatedRequest, res, next) => {
    const userId = req.user?._id;

    const userNotes = await Note.find({ createdBy: userId });

    res.status(200).json({
      status: "success",
      results: userNotes.length,
      data: { notes: userNotes },
    });
  }
);

export const createNote = catchAsync(
  async (req: IAuthenticatedRequest, res, next) => {
    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      status: "success",
      data: { note },
    });
  }
);
