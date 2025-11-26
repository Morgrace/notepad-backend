import Note from "../models/noteModel";
import { INoteRequest } from "../types";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export const getAllNotes = catchAsync(async (req, res, next) => {
  const notes = await Note.find().populate({
    path: "createdBy",
    select: "firstName lastName email _id ",
  });

  res.status(200).json({
    status: "success",
    results: notes.length,
    data: { notes },
  });
});

export const getNote = catchAsync(async (req: INoteRequest, res, next) => {
  const note = req.note;

  res.status(200).json({
    status: "success",
    data: { note },
  });
});

export const updateNote = catchAsync(async (req: INoteRequest, res, next) => {
  const note = req.note;
  const body = req.body;

  const title = body?.title;
  const content = body?.content;

  // Check if anything to update
  if (title === undefined && content === undefined) {
    return next(
      new AppError("Please provide at least one field to update", 400)
    );
  }

  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;

  const updatedNote = await note.save();

  res.status(200).json({
    status: "success",
    data: { note: updatedNote },
  });
});

export const deleteNote = catchAsync(async (req: INoteRequest, res, next) => {
  const note = req.note;

  await Note.findByIdAndDelete(note._id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
