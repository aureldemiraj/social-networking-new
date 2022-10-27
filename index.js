// const { PrismaClient } = require('@prisma/client');
import { PrismaClient } from '@prisma/client';
import express from 'express';

import userRouter from './routes/userRoutes.js';
import communityRouter from './routes/communityRoutes.js';
import eventRouter from './routes/eventRoutes.js';
import postRouter from './routes/postRoutes.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';


const prisma = new PrismaClient();
const app = express();

app.use(express.json());

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

