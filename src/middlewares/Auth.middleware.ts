import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/auth.config';

import { DataStoredInToken, RequestWithData } from '../interfaces/Auth.interface';

import { AppError } from '../utils/AppError.util';
import { catchAsync } from '../utils/CatchAsync.util';

export const restrictTo = (...roles: String[]) => {
    return catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) throw new AppError('You are not logged in.', 401);

        const decoded = jwt.verify(token, JWT_SECRET) as DataStoredInToken;

        if (!roles.includes(decoded.userRole))
            throw new AppError('You do not have permission to perform this action!', 403);

        req.userId = decoded.userId;
        req.userRole = decoded.userRole;
        next();
    });
};
