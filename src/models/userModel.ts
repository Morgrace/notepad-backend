import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    photo: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    passwordChangedAt: { type: Date, select: false },
    passwordResetExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    closedAccount: { type: Date, select: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Always delete password on response object
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Methods:
// Confirming login user password
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const UserModel = mongoose.model("User", userSchema);
