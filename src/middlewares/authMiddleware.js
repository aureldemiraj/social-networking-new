import { promisify } from 'util'
import jwt from 'jsonwebtoken';

import AppError from './../common/appError.js';
import { catchAsync } from './../common/catchAsync.js';
import { getEventById } from './../services/eventService.js';
import { getPostById } from './../services/postService.js';
import { getUserbyId, changedPasswordAfter } from './../services/userService.js';
import { isUserJoined } from './../services/communityService.js';

export const restrictTo = (...roles) => {
    return catchAsync(async (req, res, next) => {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(new AppError('You are not logged in.', 401))
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const currentUser = await getUserbyId(decoded.userId);

        if (!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist', 401))
        }

        if (currentUser.passwordChangedAt) {
            if (changedPasswordAfter(decoded.iat, currentUser.passwordChangedAt)) {
                return next(new AppError('User recently changed password! Please login again', 401))
            }
        }

        if (!roles.includes(decoded.userRole)) {
            return next(new AppError('You do not have permission to perform this action!', 403))
        }

        req.userId = decoded.userId;
        req.userRole = decoded.userRole;
        next();
    })
}

export const checkPostAuthor = catchAsync(async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.userId;

    const post = await getPostById(postId);

    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    if (!(post.authorId === userId || req.userRole === 'ADMIN')) {
        return next(new AppError('You can only edit or delete your posts', 404))
    }

    next();
})

export const checkEventOrganizer = catchAsync(async (req, res, next) => {
    const eventId = req.params.eventId;
    const userId = req.userId;

    const event = await getEventById(eventId);

    if (!event) {
        return next(new AppError('No event found with that ID', 404));
    }

    if (!(event.eventOrganizer === userId || req.userRole === 'ADMIN')) {
        return next(new AppError('You can only edit or delete your events', 404))
    }

    next();
})

export const checkIfJoined = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;
    const userId = req.userId;

    if (!communityId) {
        return next(new AppError('Please provide a community!', 400))
    }

    const userInCommunity = await isUserJoined(userId, communityId);

    if (!userInCommunity) {
        return next(new AppError('You should join the community to perform this action', 403))
    }

    next();
})

