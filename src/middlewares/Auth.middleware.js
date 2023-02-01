import { promisify } from 'util';

import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/auth.config';

import { AppError } from '../utils/AppError.util.js';
import { catchAsync } from '../utils/CatchAsync.util.js';

export const restrictTo = (...roles) => {
    return catchAsync(async (req, res, next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) throw new AppError('You are not logged in.', 401);

        const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

        if (!roles.includes(decoded.userRole))
            throw new AppError('You do not have permission to perform this action!', 403);

        req.userId = decoded.userId;
        req.userRole = decoded.userRole;
        next();
    });
};
