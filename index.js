// import fs from 'fs';
import fs from 'fs/promises';

import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import dotenv from 'dotenv';

import userRouter from './src/routes/userRoutes.js';
import communityRouter from './src/routes/communityRoutes.js';
import eventRouter from './src/routes/eventRoutes.js';
import postRouter from './src/routes/postRoutes.js';
import AppError from './src/common/appError.js';
import globalErrorHandler from './src/middlewares/errorMiddleware.js';


dotenv.config();

const app = express();

app.use(helmet());

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 1000,
    message: 'Too many requests from this IP, please try again in a minute!'
});
app.use(limiter);

app.use(express.json({ limit: '10kb' }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});

app.use('/users', userRouter);
app.use('/communities', communityRouter);
app.use('/events', eventRouter);
app.use('/posts', postRouter);

app.get('/aboutUs', async (req, res, next) => {
    const data = await fs.readFile('./test.txt', 'utf-8');

    res.status(200).json({
        status: 'success',
        data
    });
});

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
});

app.use(globalErrorHandler);