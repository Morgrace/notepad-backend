import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import { ICookieOptions, IUser } from "../types";
import { Response } from "express";

export const signToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN as StringValue;

  if (!jwtSecret || !jwtExpiresIn) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

export const verifyJWT = (
  token: string,
  secret: string
): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded as jwt.JwtPayload);
    });
  });
};

export const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id as string);

  const cookieOptions: ICookieOptions = {
    maxAge:
      Number.parseFloat(process.env.JWT_EXPIRES_IN!) * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
