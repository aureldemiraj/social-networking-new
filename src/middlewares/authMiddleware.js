import { promisify } from 'util'
import jwt from 'jsonwebtoken';

import AppError from './../common/appError.js';
import { catchAsync } from './../common/catchAsync.js';

export const restrictTo = (...roles) => {
    return catchAsync(async (req, res, next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token || token === 'null') {
            return next(new AppError('You are not logged in.', 401))
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        if (!roles.includes(decoded.userRole)) {
            return next(new AppError('You do not have permission to perform this action!', 403))
        }

        req.userId = decoded.userId;
        req.userRole = decoded.userRole;
        next();
    })
};
