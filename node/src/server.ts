import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('\u2705 Server running on port', PORT);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();