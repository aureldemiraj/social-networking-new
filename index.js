// const { PrismaClient } = require('@prisma/client');
import { PrismaClient } from '@prisma/client';
import express from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import userRouter from './src/routes/userRoutes.js';
import communityRouter from './src/routes/communityRoutes.js';
import eventRouter from './src/routes/eventRoutes.js';
import postRouter from './src/routes/postRoutes.js';
import AppError from './src/common/appError.js';
import globalErrorHandler from './src/middlewares/errorMiddleware.js';


const prisma = new PrismaClient();
const app = express();

app.use(helmet());

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 1000,
    message: 'Too many requests from this IP, please try again in a minute!'
});
app.use(limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})

// ROUTES
app.use('/users', userRouter);
app.use('/communities', communityRouter);
app.use('/events', eventRouter);
app.use('/posts', postRouter);

app.all('*', (req, res, next) => {
    // version 1
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // })

    // version 2
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode = 404;

    // next(err);

    // version 3
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})


// error middleware, which will be called when we create a new error with AppError
app.use(globalErrorHandler);

