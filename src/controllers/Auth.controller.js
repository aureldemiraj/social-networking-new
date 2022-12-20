import { Router } from 'express';
import { catchAsync } from '../utils/CatchAsync.util.js';
import { AuthService } from '../services/Auth.service.js';
import { restrictTo } from '../middlewares/Auth.middleware.js';
import { LoginRequest, SignUpRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../validators/index.js';

export const AuthController = Router();

AuthController.post(
    '/register',
    catchAsync(async (req, res, next) => {
        const payload = await SignUpRequest.validateAsync(req.body);

        const result = await AuthService.register(payload);

        res.status(result.status).send(result.data);
    })
);

AuthController.post(
    '/login',
    catchAsync(async (req, res, next) => {
        const payload = await LoginRequest.validateAsync(req.body);

        const result = await AuthService.login(payload);

        res.status(result.status).send(result.data);
    })
);

AuthController.post(
    '/forgot-password',
    catchAsync(async (req, res, next) => {
        const { email } = await ForgotPasswordRequest.validateAsync(req.body);
        const protocol = req.protocol;
        const host = req.get('host');

        const result = await AuthService.forgotPassword(email, protocol, host);

        res.status(result.status).send(result.data);
    })
);

AuthController.patch(
    '/reset-password/:token',
    catchAsync(async (req, res, next) => {
        const { token } = req.params;
        const { password } = await ResetPasswordRequest.validateAsync(req.body);

        const result = await AuthService.resetPassword(token, password);

        res.status(result.status).send(result.data);
    })
);

AuthController.post('/logout', restrictTo('USER', 'ADMIN'), (req, res, next) => {
    const result = AuthService.logout();

    res.status(result.status).send(result.data);
});
