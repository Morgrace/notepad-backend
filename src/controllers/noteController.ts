import Note from "../models/noteModel";
import catchAsync from "../utils/catchAsync";

export const createNote = catchAsync(async (req, res, next) => {
  const notes = await Note.create(req.body);

  res.status(201).json({
    status: "success",
    results: Array.isArray(notes) ? notes.length : "",
    data: notes,
  });
});

export const getAllNotes = catchAsync(async (req, res, next) => {
  const notes = await Note.find();

  res.status(200).json({
    status: "success",
    results: notes.length,
    data: notes,
  });
});

export const getNote = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const note = await Note.findById(id);

  if (!note) return next(new Error(`No note could be found with ID: ${id}`));

  res.status(200).json({
    status: "success",
    data: note,
  });
});

export const updateNote = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const note = await Note.findById(id);

  if (!note) return next(new Error("No note with that ID"));

  note.title = body.title || note.content;
  note.content = body.content || note.content;
  note.updatedAt = new Date();

  const updatedNote = await note.save();

  res.status(200).json({
    status: "success",
    data: updatedNote,
  });
});

export const deleteNote = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const note = await Note.findByIdAndDelete(id);
  if (!note) return next(new Error("No note with that ID"));

  res.status(204).json({
    status: "success",
    data: null,
  });
});
