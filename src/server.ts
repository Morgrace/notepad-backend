process.on("uncaughtException", (error) => {
  console.log("UNCAUGHT EXCEPTION! shutting down! 🤯");
  console.log(error.name, error.message);
  process.exit(1);
});

import app from "./app";
import connectDB from "./config/db";

//Connect to Database
connectDB();

//Start node server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT: ${process.env.PORT}...`);
});

process.on("unhandledRejection", (error) => {
  console.log("UNHANDLED REJECTION! shuttindg down ... 🤯");
  console.log(error);
  server.close(() => {
    process.exit(1);
  });
});
