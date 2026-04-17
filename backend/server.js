import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js'; // 1. Added this
import applicationRoutes from './routes/applicationRoutes.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'resumes');
import fs from 'fs';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Serve uploaded resumes as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/jobs', jobRoutes); // 2. Added this
app.use('/api/users', userRoutes);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[ DATABASE ] MongoDB Synchronized: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[ ERROR ] Database connection failed: ${error.message}`);
    process.exit(1); 
  }
};

connectDB();

app.get('/', (req, res) => {
  res.send('Matrix Backend Mainframe is operational...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[ SYSTEM ] Mainframe active on port ${PORT}`);
});