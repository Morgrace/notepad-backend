import mongoose from "mongoose";
import { INote } from "../types";

const noteSchema = new mongoose.Schema<INote>(
  {
    title: String,
    content: String,
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

noteSchema.methods.createdByUser = function (
  this: INote,
  candidateId: string,
  candidateRole: string
) {
  return this.createdBy.toString() === candidateId || candidateRole === "admin";
};

const Note = mongoose.model("Note", noteSchema);
export default Note;
