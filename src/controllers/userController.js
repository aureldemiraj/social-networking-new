import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import AppError from './../common/appError.js';
import { catchAsync } from './../common/catchAsync.js';
import { createSendToken, correctPassword, createUser } from './../services/userService.js';
import { getUserbyEmail, getUserbyId } from './../repositories/userRepository.js';

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
    const users = await prisma.user.findMany()

    res.status(200).json({
        message: 'Success',
        data: users
    })
}

export const register = catchAsync(async (req, res, next) => {
    // const { fullName, email, password, birthDate, education } = req.body;
    const payload = req.body;

    // todo 1) and 2)
    // 1) Check if the complete data input is filled out
    // if (!(fullName && email && password && birthDate)) {
    //     return next(new AppError('All input is required', 400))
    // }

    // 2) Check if the input data is correct

    const oldUser = await getUserbyEmail(payload.email);

    if (oldUser) {
        return next(new AppError('User already exists. Please login', 409))
    }

    const newUser = await createUser(payload);

    createSendToken(newUser, 201, res);
})

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Validate user input
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400))
    }

    // 2) Validate if user exists in our database
    const user = await getUserbyEmail(email);

    if (!user || !(await correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
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
        return next(new AppError('No user found with that ID', 400))
    }

    res.status(200).json({
        message: 'success',
        data: user
    })
})