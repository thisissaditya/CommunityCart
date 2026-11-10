import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/upload', uploadRoutes);

// System Health & Status Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CommunityCart Unified Rural Platform API',
    timestamp: new Date().toISOString(),
    database: getDBStatus() ? 'connected (MongoDB)' : 'active (resilient in-memory store)',
    version: '1.0.0-phase1',
  });
});

// Root API Welcome
app.get('/', (req, res) => {
  res.send('CommunityCart Backend Service is active and running.');
});

// Initialize Database & Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 CommunityCart API Server running on port ${PORT}`);
    console.log(`🌐 Health endpoint: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
});
