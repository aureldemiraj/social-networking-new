import { NextFunction, Request, Response, Router } from 'express';

import { CreateUserInterface } from '../interfaces/User.interface';

import { restrictTo } from '../middlewares/Auth.middleware.js';
import { validate } from '../middlewares/Validation.middleware';

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
    validate(SignUpValidator),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await AuthService.register(req.body);

        res.status(result.status).send(result.data);
    })
);

AuthController.post(
    '/login',
    validate(LoginValidator),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await AuthService.login(req.body);

        res.status(result.status).send(result.data);
    })
);

AuthController.post(
    '/forgot-password',
    validate(ForgotPasswordValidator),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const host = req.get('host') || '';
        const result = await AuthService.forgotPassword(req.body.email, req.protocol, host);

        res.status(result.status).send(result.data);
    })
);

AuthController.patch(
    '/reset-password/:token',
    validate(ResetPasswordValidator),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { token } = req.params;

        const result = await AuthService.resetPassword(token, req.body.password);

        res.status(result.status).send(result.data);
    })
);

AuthController.post('/logout', restrictTo('USER', 'ADMIN'), (req, res, next) => {
    const result = AuthService.logout();

    res.status(result.status).send(result.data);
});
