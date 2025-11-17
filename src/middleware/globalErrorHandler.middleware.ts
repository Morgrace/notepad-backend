import { NextFunction, Request, Response } from "express";
import { IAppError } from "../types";
import { ZodError } from "zod";
import { handleZodError } from "../utils/errorHanders/handleZodError";
import { handleDuplicateFieldsDB } from "../utils/errorHanders/handleDuplicateFieldDB";
import { handleValidationErrorDB } from "../utils/errorHanders/handleValidationErrorDB";
import { handleCastErrorDB } from "../utils/errorHanders/handleCastErrorDB";
import { handleJWTError } from "../utils/errorHanders/handleJWTError";
import { handleJWTExpiredError } from "../utils/errorHanders/handleJWTExpiredError";

function sendErrorInDevelopment(error: IAppError, res: Response) {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error,
  });
}

function sendErrorInProduction(error: IAppError, res: Response) {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error("ERROR", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
}

function globalErrorHandler(
  error: IAppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorInDevelopment(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let errorProd: IAppError = Object.assign({}, error);

    if (error instanceof ZodError) {
      errorProd = handleZodError(error);
    }

    if (error.code === 11000) {
      errorProd = handleDuplicateFieldsDB(errorProd);
    }

    if (error.name === "ValidationError") {
      errorProd = handleValidationErrorDB(errorProd);
    }

    if (error.name === "CastError") {
      errorProd = handleCastErrorDB(errorProd);
    }

    if (error.name === "JsonWebTokenError") {
      errorProd = handleJWTError();
    }

    if (error.name === "TokenExpiredError") {
      errorProd = handleJWTExpiredError();
    }

    sendErrorInProduction(errorProd, res);
  }
}
export default globalErrorHandler;
