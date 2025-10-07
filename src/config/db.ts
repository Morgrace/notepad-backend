import mongoose from "mongoose";

const DBconnectionString = process.env.DATABASE_URL;
const DBpassword = process.env.DATABASE_PASSWORD;

if (!DBconnectionString || !DBpassword) {
  throw new Error("Missing Database Config Variables");
}

const DB = DBconnectionString.replace("<db_password>", DBpassword);

export default async function connectDB() {
  try {
    await mongoose.connect(DB);
    console.log("MongoDB connected: 🛜");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Failed to connect to MongoDB ${error.message}`);
    }
  }
}
