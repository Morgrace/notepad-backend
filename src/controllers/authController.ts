import crypto from "node:crypto";
import { UserModel } from "../models/userModel";
import { Signup } from "../schemas/signup.schema";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { sendEmail } from "../utils/email/email";
import { resetPasswordTemplate } from "../utils/email/resetPasswordTemplate";
import { createSendToken } from "../utils/JWTHelper";
import { IAuthenticatedRequest } from "../types";

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

export const forgotPassword = catchAsync(async (req, res, next) => {
  // Get user
  const user = await UserModel.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }

  // Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it to user's email
  const recipentEmail =
    process.env.NODE_ENV === "development"
      ? process.env.EMAIL_TEST
      : user.email;

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  try {
    const { error, data } = await sendEmail({
      email: recipentEmail,
      subject: "Password Reset",
      html: resetPasswordTemplate({
        fullName: `${user.firstName} ${user.lastName}`,
        passwordResetLink: resetURL,
        linkExpiresIn: "10 minutes",
      }),
    });

    if (error) {
      throw new Error(error.message || "Failed to send email");
    }

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("Error sending email. Please try again later", 500)
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

export const updateMyPassword = catchAsync(
  async (req: IAuthenticatedRequest, res, next) => {
    if (!req.user) {
      return next(
        new AppError("You must be logged in to perform this action", 401)
      );
    }

    // Get user from colleciton
    const user = await UserModel.findById(req.user._id).select("+password");

    if (!user) {
      return next(new AppError("User does not exist! Please signup!", 404));
    }

    // Check if POSTed current password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("Your current password is wrong", 401));
    }

    // Update password
    user.password = req.body.password;
    user.passwordChangedAt = new Date(Date.now() - 1000);
    await user.save();

    //Log user in, send JWT
    createSendToken(user, 200, res);
  }
);

export const logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });

  res.status(200).json({
    status: "success",
    message: "logged out successfully",
  });
});
