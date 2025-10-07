import "dotenv/config";
import express from "express";
import morgan from "morgan";

import noteRouter from "./routes/noteRoutes";

const app = express();

//parse request body
app.use(express.json());
app.use(morgan("dev"));

//Routes
app.use("/api/v1/notes", noteRouter);

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
