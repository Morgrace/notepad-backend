import mongoose from "mongoose";
import { INote } from "../types";
import { UserModel } from "./userModel";

const noteSchema = new mongoose.Schema<INote>(
  {
    title: String,
    content: String,
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Note Must be created by a user!"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Preserving and passing isNew state; since Mongoose will set 'isNew' to 'false' if save() succeeds
noteSchema.pre("save", function () {
  this.$locals.wasNew = this.isNew;
});

// Updates the notes[] in UserModel
noteSchema.post("save", async function () {
  if (this.$locals.wasNew) {
    await UserModel.findByIdAndUpdate(this.createdBy, {
      $addToSet: { notes: this._id },
    });
  }
});

noteSchema.methods.createdByUser = function (
  this: INote,
  candidateId: string,
  candidateRole: string
) {
  return this.createdBy.toString() === candidateId || candidateRole === "admin";
};

const Note = mongoose.model("Note", noteSchema);
export default Note;
