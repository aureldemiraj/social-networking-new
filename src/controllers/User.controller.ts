import { NextFunction, Request, Response, Router } from 'express';

import { restrictTo } from '../middlewares/Auth.middleware';

import { catchAsync } from '../utils/CatchAsync.util';

import { UserService } from '../services/User.service';

export const UserController = Router();

UserController.get(
    '/',
    restrictTo('ADMIN'),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await UserService.getAllUsers();

        res.status(result.status).send(result.data);
    })
);

UserController.get(
    '/:userId',
    restrictTo('USER', 'ADMIN'),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;

        const result = await UserService.getUser(userId);

        res.status(result.status).send(result.data);
    })
);
