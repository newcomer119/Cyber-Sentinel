// src/index.js
import express from 'express';
import connectDB from './config/db.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors({
  origin: 'http://localhost:5174', // Allow only this origin
}));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/leaderboard', leaderboardRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});