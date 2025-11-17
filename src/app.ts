import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import mongoSanitize from "@exortek/express-mongo-sanitize";
import compression from "compression";
import helmet from "helmet";
import mongoose from "mongoose";

import globalErrorHandler from "./middleware/globalErrorHandler.middleware";
import noteRouter from "./routes/noteRoutes";
import userRouter from "./routes/userRoutes";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import AppError from "./utils/appError";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://note-pad-frontend-nine.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

// Needed to parse complex query strings to js objects might not need it in this application
app.set("query parser", "extended");

//parse request body
app.use(express.json({ limit: "10kb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Set Security Http headers
app.use(helmet());

// Compress Response body with gzip
app.use(compression());

// Sanitization against NOSQL query injection
app.use(mongoSanitize());

// Prevent http parameter pollution
app.use(hpp());

const rateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30mins
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again in 30 minutes!",
  },
});
// Limit request from same ip
app.use("/api", rateLimiter);
//Routes
app.use("/api/v1/notes", noteRouter);
app.use("/api/v1/users", userRouter);

// Health check
app.get("/api/v1/health", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: "write-it-down-server",
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      service: "write-it-down-server",
      database: "disconnected",
    });
  }
});

//Handling undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global error handler
app.use(globalErrorHandler);

export default app;
