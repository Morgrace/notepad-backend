import app from "./app";
import connectDB from "./config/db";

//Connect to Database
connectDB();

//Start node server
app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT: ${process.env.PORT}...`);
});
