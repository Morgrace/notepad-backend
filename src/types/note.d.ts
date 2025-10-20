import mongoose, { Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
  createdByUser: (candidateId: string, candidateRole: string) => boolean;
}
