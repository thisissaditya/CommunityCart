import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/communitycart';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Local/Cloud MongoDB not connected (${error.message}).`);
    console.log(`[MongoDB Fallback] Running with in-memory resilient mock database for Phase 1!`);
    isConnected = false;
  }
};

export const getDBStatus = () => isConnected;
