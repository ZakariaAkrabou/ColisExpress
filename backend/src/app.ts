import express, { Application} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import path from 'path';
import authRoutes from './routes/auth.route';
import clientRoutes from './routes/client.route';
import colisRoutes from './routes/colis.route';
import locationRoutes from './routes/location.route';
import adminRoutes from './routes/admin.route';
import backupRoutes from './routes/backup.route';


const createApp = (): Application => {
  const app = express();


  app.use(helmet());
  app.use(cors({
    origin: '*'
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(morgan('dev'));

//   const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//   });
//   app.use(limiter);
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


  app.use('/api/auth', authRoutes);
  app.use('/api/clients', clientRoutes);
  app.use('/api/colis', colisRoutes);
  app.use('/api/locations', locationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/backup', backupRoutes);



  return app;
};

export default createApp;
