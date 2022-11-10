import AppError from "../common/appError.js";

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);

const handleValidationError = err =>
    new AppError(`Invalid data input. ${err.message}`, 400)

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err, message: err.message, name: err.name, stack: err.stack };

    if (error.name === 'ValidationError') error = handleValidationError(error);
    else if (error.name === 'JsonWebTokenError') error = handleJWTError();
    else if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        })
    } else {
        console.log(error.stack);

        return res.status(error.statusCode).json({
            status: error.status,
            message: 'Something went wrong! Please try again later'
        })
    }
}