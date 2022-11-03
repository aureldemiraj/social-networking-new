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
} from './../services/userService.js';
import signUpRequest from './../validations/signUpRequest.js';
import loginInRequest from './../validations/logInRequest.js';

export const getUsers = async (req, res, next) => {
    const users = await getAllUsers();

    res.status(200).json({
        message: 'Success',
        data: users
    });
};

export const register = catchAsync(async (req, res, next) => {
    const payload = await signUpRequest.validateAsync(req.body);

    const oldUser = await getUserbyEmail(payload.email);

    if (oldUser) {
        return next(new AppError('User already exists. Please login', 400))
    }

    const newUser = await createUser(payload);

    createSendToken(newUser, 201, res);
})

export const login = catchAsync(async (req, res, next) => {
    const payload = await loginInRequest.validateAsync(req.body);

    const user = await getUserbyEmail(payload.email);

    if (!user || !(await correctPassword(payload.password, user.password))) {
        return next(new AppError('Incorrect email or password', 400))
    }

    createSendToken(user, 200, res);
})

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

    res.status(200).json({
        message: 'success',
        data: user
    })
})

export const forgotPassword = catchAsync(async (req, res, next) => {
    const payload = req.body;

    const user = await getUserbyEmail(payload.email);

    if (!user) {
        return next(new AppError('No user found with that ID', 404))
    }
});

export const resetPassword = catchAsync(async (req, res, next) => {

});