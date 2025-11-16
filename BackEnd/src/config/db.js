// src/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  // Use environment variable in production; fallback to local DB for dev only
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/plant_nursary_local";

  try {
    console.log("Connecting to MongoDB... (using MONGO_URI?)", !!process.env.MONGO_URI);
    // Use default driver options (no deprecated flags)
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err?.message || err);
    // Throw so caller can decide to exit
    throw err;
  }
};

export default connectDB;
