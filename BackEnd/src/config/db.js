import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/plant_nursary";

  try {
    console.log("Connecting to MongoDB... (using MONGO_URI?)", !!process.env.MONGO_URI);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err && err.message ? err.message : err);
    throw err; // do not continue server start
  }
};

export default connectDB;
