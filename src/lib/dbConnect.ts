import mongoose from "mongoose";

const MONGODB_URL = process.env.DB_CONN_STRING ?? "";

if (!MONGODB_URL) {
  throw new Error(
    "Please define the DB_CONN_STRING environment variable inside .env.local"
  );
}

export default async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URL, {
      serverSelectionTimeoutMS: 10000, // ⏱️ helps avoid infinite hanging on bad servers
      socketTimeoutMS: 45000, // ⏱️ extra safety for slow networks
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
