import 'dotenv/config'; // must be first: loads .env before any module reads process.env
import http from 'http';
import createApp from './app';
import {connectDB} from './config/database';

const PORT = process.env.PORT || '5000';
const MONGO_URL = process.env.DATABASE_URL || '';
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!MONGO_URL) {
  console.error('MONGO_URL is not defined in environment. Exiting.');
  process.exit(1);
}

const app = createApp();
const server = http.createServer(app);

const start = async () => {
  try {
    await connectDB(MONGO_URL);
    server.listen(PORT, () => {
      console.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};

start();

const gracefulShutdown = (signal: string) => {
  console.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.info('HTTP server closed.');
    import('mongoose').then(mongoose => {
      mongoose.connection.close(false).then(() => {
        console.info('MongoDB connection closed.');
        process.exit(0);
      });
    });
  });

  setTimeout(() => {
    console.error('Forcing shutdown.');
    process.exit(1);
  }, 10_000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));