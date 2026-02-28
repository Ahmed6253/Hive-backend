import mongoose from "mongoose";
import env from "./env.js";

export const connectDB = async () => {
  try {
    const connction = await mongoose.connect(env.mongodbUri);
    console.log(`MongoDB connected: ${connction.connection.host}`);
  } catch (error) {
    console.log("MongoDB error: " + error);
  }
};
