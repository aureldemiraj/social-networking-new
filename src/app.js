import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { AppError } from './utils/AppError.util.js';
import { errorMiddleware } from './middlewares/Error.middleware.js';
import { routes } from './routes.js';
import * as EventIndex from './events/index.js';

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
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);