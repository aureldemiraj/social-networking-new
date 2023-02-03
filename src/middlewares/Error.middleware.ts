import { ErrorRequestHandler } from 'express';

import { AppError } from '../utils/AppError.util';

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const handleValidationError = (err: any) => new AppError(`Invalid data input. ${err.message}`, 400);

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = {
        ...err,
        message: err.message,
        name: err.name,
        stack: err.stack,
    };

    if (error.name == 'ValidationError') error = handleValidationError(error);
    else if (error.name == 'JsonWebTokenError') error = handleJWTError();
    else if (error.name == 'TokenExpiredError') error = handleJWTExpiredError();

    return res.status(error.statusCode).send({
        status: error.status,
        message: error.isOperational ? error.message : 'Something went wrong! Please try again later',
    });
};
