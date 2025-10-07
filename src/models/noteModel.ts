import mongoose, { Document } from "mongoose";

type Note = Document & {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

const noteSchema = new mongoose.Schema<Note>({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const Note = mongoose.model("Note", noteSchema);
export default Note;
