import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectDB() {
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB connected');
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
