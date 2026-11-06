import mongoose from 'mongoose';

const DATABASE_URL = process.env.DATABASE_URL || '';

export async function connectDB(DATABASE_URL: string): Promise<void> {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  try {
    await mongoose.connect(DATABASE_URL);
    console.log('Database connected Successfully');
  } catch (err) {
    console.error('DataBase connection error:', err);
    throw err;
  }
}

export function disconnectDB(): Promise<void> {
  return mongoose.disconnect();
}