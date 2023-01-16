import { Router } from 'express';

import { restrictTo } from '../middlewares/Auth.middleware.js';

import { AuthService } from '../services/Auth.service.js';

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
    catchAsync(async (req, res, next) => {
        const payload = await SignUpValidator.validateAsync(req.body);

        const result = await AuthService.register(payload);

        res.status(result.status).send(result.data);
    })
);

AuthController.post(
    '/login',
    catchAsync(async (req, res, next) => {

        const payload = await LoginValidator.validateAsync(req.body);

        const result = await AuthService.login(payload);

        res.status(result.status).send(result.data);
    })
);

AuthController.post(
    '/forgot-password',
    catchAsync(async (req, res, next) => {
        const { email } = await ForgotPasswordValidator.validateAsync(req.body);

        const result = await AuthService.forgotPassword(email, req.protocol, req.get('host'));

        res.status(result.status).send(result.data);
    })
);

AuthController.patch(
    '/reset-password/:token',
    catchAsync(async (req, res, next) => {
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
