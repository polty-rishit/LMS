import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import applicationRoutes from './routes/applications';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Allow all origins — handles localhost dev + any Vercel/Render deployment
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow all origins
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests for all routes
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'LMS API is running' });
});

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

export default app;
