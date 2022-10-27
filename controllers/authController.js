import { promisify } from 'util'
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import AppError from './../utils/appError.js';
import { catchAsync } from './../utils/catchAsync.js'

const prisma = new PrismaClient();

export const register = catchAsync(async (req, res, next) => {
    const { fullName, email, password, passwordConfirm, birthDate, education } = req.body;

    if (password !== passwordConfirm) {
        return next(new AppError('Passwords didn\'t match!', 404))
    }

    // 1) Check if the complete data input is filled out
    if (!(fullName && email && password && passwordConfirm && birthDate)) {
        return next(new AppError('All input is required', 400))
    }

    // 2) Check if the input data is correct

    // 3) Check if user already exists
    const oldUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (oldUser) {
        return next(new AppError('User already exists. Please login', 409))
    }

    // 4) Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 12);

    // 5) Create user in database
    const newUser = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            fullName: fullName,
            password: encryptedPassword,
            birthDate: birthDate,
            education: education
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            birthDate: true,
            education: true
        }
    })

    // 6) Create token
    createSendToken(newUser, 201, res);
})

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Validate user input
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400))
    }

    // 2) Validate if user exists in our database
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            birthDate: true,
            education: true,
            password: true
        }
    })

    if (!user || !(await correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    // 3) Create token
    createSendToken(user, 200, res)

})

export const protect = catchAsync(async (req, res, next) => {

    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new AppError('You are not logged in.', 401))
    }

    // 2) Verificate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // console.log(decoded)
    // 3) Check if user still exists
    const currentUser = await prisma.user.findUnique({
        where: {
            id: decoded.id
        },
        // I will use it to check if user is joined in a community to let him create post or event
        include: {
            communities: {
                select: {
                    communityId: true
                }
            }
        }
    })

    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist', 401))
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.passwordChangedAt) {
        if (changedPasswordAfter(decoded.iat, currentUser.passwordChangedAt)) {
            return next(new AppError('User recently changed password! Please login again', 401))
        }
    }

    req.user = currentUser;
    next();
})

export const restrict = catchAsync(async (req, res, next) => {

    const communityId = req.params.communityId;
    const communitiesJoined = req.user.communities.map(el => el.communityId);

    if (!communitiesJoined.includes(communityId)) {
        return next(new AppError('Join the community to make this action.', 401))
    }

    next();
})

export const checkPostAuthor = catchAsync(async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })

    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    if (!(post.authorId === userId || req.user.role === 'ADMIN')) {
        return next(new AppError('You can only edit or delete your posts', 404))
    }

    next();
})

export const checkEventOrganizer = catchAsync(async (req, res, next) => {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    const event = await prisma.event.findUnique({
        where: {
            id: eventId
        }
    })

    if (!event) {
        return next(new AppError('No event found with that ID', 404));
    }

    if (!(event.eventOrganizer === userId || req.user.role === 'ADMIN')) {
        return next(new AppError('You can only edit or delete your events', 404))
    }

    next();
})

export const adminOnly = catchAsync(async (req, res, next) => {
    if (!(req.user.role === 'ADMIN')) {
        return next(new AppError('You do not have access!', 401))
    }

    next();
})

const changedPasswordAfter = (JWTTimestamp, passwordChangedAt) => {
    const changedTimestamp = parseInt(
        passwordChangedAt.getTime() / 1000,
        10
    )

    return JWTTimestamp < changedTimestamp
}

const correctPassword = (candidatePassword, userPassword) => {
    return bcrypt.compare(candidatePassword, userPassword)
}

const createSendToken = (user, statusCode, res) => {
    const userId = user.id;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    const cookieOptions = {
        hhtpOnly: true
    };

    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}