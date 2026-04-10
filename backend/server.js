import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js'; // 1. Added this
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';


dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
})); 
app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);
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