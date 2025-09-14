import express from 'express';
import { connectDB } from './config/database';
import { config } from './config/env';
import middleware from './middleware/middleware';
import errorHandler from './middleware/errorHandler';
import indexRoutes from './routes/index';

const app = express();

app.use(middleware);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Travel Assistant API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use('/api', indexRoutes);

app.use(errorHandler);

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  if (config.server.env === 'production') {
    console.error('Critical error, shutting down...');
    process.exit(1);
  }
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  if (config.server.env === 'production') {
    console.error('Critical error, shutting down...');
    process.exit(1);
  }
});

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`Travel Assistant API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Chat endpoint: http://localhost:${PORT}/api/conversation/chat`);
  connectDB();
});