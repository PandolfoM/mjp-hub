import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    mongoose.connection.on("connected", () => {
      isConnected = true;
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error: " + err);
    });
  } catch (error) {
    console.error("MongoDB connection error: " + error);
    throw error;
  }
}
