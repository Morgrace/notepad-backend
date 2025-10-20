import { UserModel } from "../../models/userModel";
import { IAuthenticatedRequest } from "../../types";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import { verifyJWT } from "../../utils/JWTHelper";

export const protect = catchAsync(
  async (req: IAuthenticatedRequest, res, next) => {
    let token;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return next(
        new AppError("You are not logged in! Please log in to get access", 401)
      );

    const decoded = await verifyJWT(token, process.env.JWT_SECRET!);

    const currentUser = await UserModel.findById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist",
          401
        )
      );
    }

    req.user = currentUser;
    next();
  }
);
