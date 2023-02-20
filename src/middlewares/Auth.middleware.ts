import { NextFunction } from 'express';

import { RequestWithData } from '../interfaces/Auth.interface';

import { AuthService } from '../services/Auth.service';

import { AppError } from '../utils/AppError.util';
import { catchAsync } from '../utils/CatchAsync.util';

export const restrictTo = (...roles: String[]) => {
    return catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) throw new AppError('You are not logged in.', 401);

        const decoded = await AuthService.verifyToken(token, roles);

        req.userId = decoded.userId;
        req.userRole = decoded.userRole;
        next();
    });
};
