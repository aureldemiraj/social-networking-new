import { PrismaClient } from '@prisma/client';

import { catchAsync } from './../utils/catchAsync.js'
import AppError from './../utils/appError.js'

const prisma = new PrismaClient();


export const getCommunities = catchAsync(async (req, res, next) => {

    const allCommunities = await prisma.community.findMany({
        select: {
            id: true,
            name: true,
            description: true
        }
    });

    res.status(200).json({
        status: 'success',
        results: allCommunities.length,
        data: allCommunities
    })
})

export const createCommunity = catchAsync(async (req, res, next) => {
    const { communityName, communityDescription } = req.body;

    const newCommunity = await prisma.community.create({
        data: {
            name: communityName,
            description: communityDescription
        },
        select: {
            id: true,
            name: true,
            description: true
        }
    })

    res.status(201).json({
        status: 'success',
        data: newCommunity
    })
})

export const getCommunity = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;

    const community = await prisma.community.findUnique({
        where: {
            id: communityId
        },
        select: {
            id: true,
            name: true,
            description: true
        }
    })

    if (!community) {
        return next(new AppError('No community found with that ID', 400))
    }

    res.status(200).json({
        status: 'success',
        data: community
    })
})

export const joinCommunity = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;
    const userId = req.user.id;

    const joinedUser = await prisma.usersOnCommunities.create({
        data: {
            userId: userId,
            communityId: communityId
        }
    })

    res.status(200).json({
        status: 'success',
        data: joinedUser
    })
})

export const leaveCommunity = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;
    const userId = req.user.id;

    const goneUser = await prisma.usersOnCommunities.delete({
        where: {
            communityUsers: { userId, communityId }
        }
    })

    res.status(204).json({
        status: 'success',
        data: null
    })
})