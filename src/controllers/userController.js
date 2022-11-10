import AppError from './../common/appError.js';
import { catchAsync } from './../common/catchAsync.js';
import sendEmail from '../common/email.js';
import {
    getUserbyEmail,
    getUserbyId,
    createToken,
    correctPassword,
    createUser,
    getAllUsers,
    createPasswordResetToken,
    updateUserForResetPassword,
    getUserByResetToken,
    updateUserPassword,
    deleteUserById
} from './../services/userService.js';
import {
    loginInRequest,
    signUpRequest,
    forgotPasswordRequest,
    resetPasswordRequest
} from './../validations/index.js';
import awaitEventEmitter from 'await-event-emitter';

const EventEmitter = awaitEventEmitter.default;
const emailEmitter = new EventEmitter();

emailEmitter.on('sendEmail', async (obj) => {
    await sendEmail(obj);
})

export const register = catchAsync(async (req, res, next) => {
    const payload = await signUpRequest.validateAsync(req.body);

    const oldUser = await getUserbyEmail(payload.email);

    if (oldUser) {
        return next(new AppError('User already exists. Please login', 400))
    }

    const newUser = await createUser(payload);

    const token = createToken(newUser);

    res.status(201).json({
        status: 'success',
        token
    });
});

export const login = catchAsync(async (req, res, next) => {
    const payload = await loginInRequest.validateAsync(req.body);

    const user = await getUserbyEmail(payload.email);

    if (!user || !(await correctPassword(payload.password, user.password))) {
        return next(new AppError('Incorrect email or password', 400))
    }

    const token = createToken(user);

    res.status(200).json({
        status: 'success',
        token
    });
});

export const getUsers = async (req, res, next) => {
    const users = await getAllUsers();

    res.status(200).json({
        message: 'Success',
        data: users
    });
};

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
    });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
    const payload = await forgotPasswordRequest.validateAsync(req.body);

    const user = await getUserbyEmail(payload.email);

    if (!user) {
        return next(new AppError('No user found with that email', 404))
    }

    const resetToken = await createPasswordResetToken(user.email);

    const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;

    const message = `<h1>Forgot your password?</h1>
            <p>Submit a PATCH request with your new password <a href="${resetURL}">HERE</a>. 
            <br>If you didn't forget your password, please ignore this email!</p>`;

    try {
        await emailEmitter.emit('sendEmail', {
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
            new AppError('There was an error sending the email. Try again later!', 500)
        );
    }
});

export const resetPassword = catchAsync(async (req, res, next) => {
    const payload = await resetPasswordRequest.validateAsync(req.body);

    const user = await getUserByResetToken(req.params.token);

    if (!user) {
        return next(new AppError('Token is invalid or has expired!', 400))
    }

    await updateUserPassword(user.id, payload.password);

    const token = createToken(user);

    res.status(200).json({
        status: 'success',
        token,
    });
});

export const deleteMe = catchAsync(async (req, res, next) => {
    const userId = req.userId;

    const deletedUser = await deleteUserById(userId);

    if (!deletedUser) {
        return next(new AppError('No user found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        token: null
    });
});

export const logout = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'You have been Logged Out',
        token: null
    })
};