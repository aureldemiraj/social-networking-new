import { Router } from 'express';
import { catchAsync } from '../utils/CatchAsync.util.js';
import { UserService } from '../services/User.service.js';
import { restrictTo } from '../middlewares/Auth.middleware.js';

export const UserController = Router();

UserController.get('/', restrictTo('ADMIN'), async (req, res, next) => {
    const result = await UserService.getAllUsers();

    res.status(result.status).send(result.data);
});

UserController.get(
    '/:userId',
    restrictTo('USER', 'ADMIN'),
    catchAsync(async (req, res, next) => {
        const { userId } = req.params;

        const result = await UserService.getUser(userId);

        res.status(result.status).send(result.data);
    })
);
