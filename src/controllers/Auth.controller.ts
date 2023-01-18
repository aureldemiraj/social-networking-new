import { Router, Request, Response, NextFunction } from 'express';

import { CreateUserInterface } from '../interfaces/User.interface';

import { restrictTo } from '../middlewares/Auth.middleware.js';

import { AuthService } from '../services/Auth.service';

import { catchAsync } from '../utils/CatchAsync.util.js';

import {
    ForgotPasswordValidator,
    LoginValidator,
    ResetPasswordValidator,
    SignUpValidator,
} from '../validators/index.js';

export const AuthController = Router();

AuthController.post(
    '/register',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const payload: CreateUserInterface = await SignUpValidator.validateAsync(req.body);

        const result = await AuthService.register(payload);

        res.status(result.status).send(result.data);
    })
);

AuthController.post(
    '/login',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const payload: Pick<CreateUserInterface, 'email' | 'password'> = await LoginValidator.validateAsync(req.body);

        const result = await AuthService.login(payload);

        res.status(result.status).send(result.data);
    })
);

AuthController.post(
    '/forgot-password',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { email } = await ForgotPasswordValidator.validateAsync(req.body);

        const host = req.get('host') || '';
        const result = await AuthService.forgotPassword(email, req.protocol, host);

        res.status(result.status).send(result.data);
    })
);

AuthController.patch(
    '/reset-password/:token',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { token } = req.params;

        const { password } = await ResetPasswordValidator.validateAsync(req.body);

        const result = await AuthService.resetPassword(token, password);

        res.status(result.status).send(result.data);
    })
);

AuthController.post('/logout', restrictTo('USER', 'ADMIN'), (req, res, next) => {
    const result = AuthService.logout();

    res.status(result.status).send(result.data);
});
