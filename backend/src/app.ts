import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes/auth.route';
import locationRoutes from './routes/location.route';


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


  app.use('/api/auth', routes);
  app.use('/api/locations', locationRoutes);



  return app;
};

export default createApp;