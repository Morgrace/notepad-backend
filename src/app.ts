import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import noteRouter from "./routes/noteRoutes";
import userRouter from "./routes/userRoutes";

const app = express();

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
//parse request body
app.use(express.json());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

//Routes
app.use("/api/v1/notes", noteRouter);
app.use("/api/v1/users", userRouter);

//Handling undefined routes
app.use((req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on this server!`));
});

//Global error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    errorMessage: err.message,
    err,
  });
});

export default app;
