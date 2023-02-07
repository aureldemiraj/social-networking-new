import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

import * as EventIndex from './events';

import { errorMiddleware } from './middlewares/Error.middleware';

import { routes } from './routes';

import { AppError } from './utils/AppError.util';

export const app = express();

app.use(cors());

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 1000,
    message: 'Too many requests from this IP, please try again in a minute!',
});
app.use(limiter);

app.use(express.json({ limit: '10kb' }));

routes(app);

app.all('*', (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
});

app.use(errorMiddleware);
