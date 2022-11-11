import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './src/routes/userRoutes.js';
import communityRouter from './src/routes/communityRoutes.js';
import eventRouter from './src/routes/eventRoutes.js';
import aboutUs from './src/routes/aboutUs.js';
import postRouter from './src/routes/postRoutes.js';
import AppError from './src/common/appError.js';
import globalErrorHandler from './src/middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(cors());

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

app.use('/api/users', userRouter);
app.use('/api/communities', communityRouter);
app.use('/api/events', eventRouter);
app.use('/api/posts', postRouter);

app.get('/api/aboutus', aboutUs);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
});

app.use(globalErrorHandler);