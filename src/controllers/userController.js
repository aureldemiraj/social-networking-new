import crypto from 'crypto';

import bcrypt from 'bcryptjs';

import AppError from './../common/appError.js';
import { catchAsync } from './../common/catchAsync.js';
import {
    getUserbyEmail,
    getUserbyId,
    createSendToken,
    correctPassword,
    createUser,
    getAllUsers,
    createPasswordResetToken,
    updateUserForResetPassword,
    getUserByResetToken,
    updateUserPassword,
} from './../services/userService.js';
import signUpRequest from './../validations/signUpRequest.js';
import loginInRequest from './../validations/logInRequest.js';
import sendEmail from '../common/email.js';

export const register = catchAsync(async (req, res, next) => {
    const payload = await signUpRequest.validateAsync(req.body);

    const oldUser = await getUserbyEmail(payload.email);

    if (oldUser) {
        return next(new AppError('User already exists. Please login', 400))
    }

    const newUser = await createUser(payload);

    createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
    const payload = await loginInRequest.validateAsync(req.body);

    const user = await getUserbyEmail(payload.email);

    if (!user || !(await correctPassword(payload.password, user.password))) {
        return next(new AppError('Incorrect email or password', 400))
    }

    createSendToken(user, 200, res);
});

export const getMe = catchAsync(async (req, res, next) => {
    req.params.userId = req.userId;
    next();
})

export const getUser = catchAsync(async (req, res, next) => {
    const userId = req.params.userId;

    const user = await getUserbyId(userId);

    if (!user) {
        return next(new AppError('No user found with that ID', 404))
    }

    user.role = undefined;

    res.status(200).json({
        message: 'success',
        data: user
    });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get the user based on POSTed email 
    const payload = req.body;

    const user = await getUserbyEmail(payload.email);

    if (!user) {
        return next(new AppError('No user found with that ID', 404))
    }

    // 2) Generate the random reset token
    const resetToken = await createPasswordResetToken(user.email);

    const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;


    // 3) Send it to user's email
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        await updateUserForResetPassword(user.email, null, null);

        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );
    }
});

export const resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const user = await getUserByResetToken(req.params.token);

    // 2) If token has not expired, and there is a user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired!', 400))
    }

    await updateUserPassword(user.id, req.body.password);

    // 3) Update changePasswordAt

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
});

export const getUsers = async (req, res, next) => {
    const users = await getAllUsers();

    res.status(200).json({
        message: 'Success',
        data: users
    });
};
