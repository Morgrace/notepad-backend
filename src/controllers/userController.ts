import Note from "../models/noteModel";
import { UserModel } from "../models/userModel";
import { IAuthenticatedRequest, IUser } from "../types";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export const getMe = catchAsync(
  async (req: IAuthenticatedRequest, res, next) => {
    res.status(200).json({
      status: "success",
      data: { user: req.user },
    });
  }
);
export const getMyNotes = catchAsync(
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

export const updateMe = catchAsync(
  async (req: IAuthenticatedRequest, res, next) => {
    // Create error if user POSTs password data
    if (req.body?.password || req.body?.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword",
          400
        )
      );
    }

    // Filter only allowed fields

    const allowedFields = ["firstName", "lastName"];

    const filteredBody: any = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) {
        filteredBody[key] = req.body[key];
      }
    });

    // Add photo if uploaded
    if (req.file) {
      const relativePath = `/upload/image/users/${req.file.filename}`;
      filteredBody.photo = relativePath;
    }

    // Check if there are actually fields to update
    if (Object.keys(filteredBody).length === 0) {
      return next(new AppError("No valid fields provided for update", 400));
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

export const deleteMe = catchAsync(async (req: IAuthenticatedRequest, res) => {
  await UserModel.findByIdAndUpdate(req.user._id, {
    active: false,
    closedAccount: Date.now(),
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getUser = catchAsync(
  async (req: IAuthenticatedRequest, res, next) => {
    const query = UserModel.findById(req.params?.id);

    // if(req.user?.role === 'admin'){

    // }
    query.select("+active +closedAccount -__v");
    query.setOptions({ includeInactive: true });

    const user = await query;

    if (!user) {
      return next(
        new AppError(`User with ID:${req.params?.id} does not exist`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  }
);

export const updateUser = catchAsync(
  async (req: IAuthenticatedRequest, res, next) => {
    if (req.body.password) {
      return next(
        new AppError(
          "use /updateMyPassword to update updatePasswordSchema",
          400
        )
      );
    }

    const allowedFieldsToUpdate = ["role", "active", "closedAccount", "email"];

    const updates = Object.keys(req.body);

    const hasInvalidField = updates.some(
      (key) => !allowedFieldsToUpdate.includes(key)
    );

    if (hasInvalidField) {
      return next(new AppError("You cannot update restricted fields", 400));
    }

    const query = UserModel.findById(req.params.id);

    query.select("+active +closedAccount -__v");
    query.setOptions({ includeInactive: true });

    const user = await query;
    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    Object.assign(user, req.body);
    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

export const deleteUser = catchAsync(async (req, res, next) => {
  const query = UserModel.findByIdAndDelete(req.params.id);

  query.setOptions({
    includeInactive: true,
  });

  const user = await query;
  if (!user) {
    return next(new AppError("No User found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const query = UserModel.find();
  query.select("+active +closedAccount -__v");

  query.setOptions({
    includeInactive: true,
  });
  const users = await query;
  if (!users) {
    return next(new AppError("No users found", 404));
  }
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
