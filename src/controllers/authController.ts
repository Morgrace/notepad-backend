import { UserModel } from "../models/userModel";
import { Signup } from "../schemas/signup.schema";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { createSendToken } from "../utils/JWTHelper";

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await UserModel.create<Omit<Signup, "passwordConfirm">>({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });
  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const userEmail = req.body?.email;
  const userPassword = req.body?.password;

  // validate email and password inputs
  if (!userEmail || !userPassword) {
    return next(new AppError("Please provide email and password", 400));
  }

  // validate user and user password
  const user = await UserModel.findOne({ email: userEmail }).select(
    "+password"
  );

  if (!user) {
    return next(new AppError("Incorrect Email or Password", 401));
  }

  const correctPassword = await user.correctPassword(
    userPassword,
    user.password
  );

  if (!correctPassword) {
    return next(new AppError("Incorrect Email or Password", 401));
  }

  createSendToken(user, 200, res);
});
