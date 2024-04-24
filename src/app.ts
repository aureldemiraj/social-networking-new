import express from 'express';
export const app = express();

import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { Server } from 'socket.io';
import { errorMiddleware } from './middlewares/Error.middleware';
import { routes } from './routes';
import { createServer } from 'http';
import { AppError } from './utils/AppError.util';
import { resolve } from 'path';
import { CommunityHandler } from './websocket-handlers/Community.handler';

const httpServer = createServer(app);

const io = new Server(httpServer);

app.get('/', (req, res) => {
    res.sendFile(resolve(__dirname, '../public/index.html'));
    //   res.send("<h1>Hello world</h1>");
});

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

CommunityHandler(io);
export { httpServer, io };
