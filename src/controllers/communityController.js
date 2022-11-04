import {
    createNewCommunity,
    getAllCommunities,
    getCommunityById,
    getCommunityByName,
    joinCommunitybyId,
    leaveCommunitybyId,
    topLargestCommunites,
    topMostActiveCommunities,
    isUserJoined,
    getMyCommunities
} from './../services/communityService.js';
import { catchAsync } from './../common/catchAsync.js';
import AppError from './../common/appError.js';
import createRequest from './../validations/createCommunityRequest.js';

export const getCommunities = catchAsync(async (req, res, next) => {
    const allCommunities = await getAllCommunities();

    res.status(200).json({
        status: 'success',
        data: allCommunities
    });
});

export const createCommunity = catchAsync(async (req, res, next) => {
    const payload = await createRequest.validateAsync(req.body);

    const oldCommunity = await getCommunityByName(payload.name);

    if (oldCommunity) {
        return next(new AppError('This community already exists.', 400))
    }

    const newCommunity = await createNewCommunity(payload);

    res.status(201).json({
        status: 'success',
        data: newCommunity
    });
});

export const getCommunity = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;

    const community = await getCommunityById(communityId);

    if (!community) {
        return next(new AppError('No community found with that ID', 400))
    }

    res.status(200).json({
        status: 'success',
        data: community
    });
});

export const joinCommunity = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;
    const userId = req.userId;

    const community = await getCommunityById(communityId);

    if (!community) {
        return next(new AppError('No community found with that ID', 400))
    }

    const userJoined = await isUserJoined(userId, communityId);

    if (userJoined) {
        return next(new AppError('You are already joined in this community.', 400))
    }

    const joinedUser = await joinCommunitybyId(userId, communityId);

    res.status(200).json({
        status: 'success',
        data: joinedUser
    });
});

export const leaveCommunity = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;
    const userId = req.userId;

    const community = await getCommunityById(communityId);

    if (!community) {
        return next(new AppError('No community found with that ID', 400))
    }

    const userJoined = await isUserJoined(userId, communityId);

    if (!userJoined) {
        return next(new AppError('You are not joined in this community.', 400))
    }

    const goneUser = await leaveCommunitybyId(userId, communityId);

    res.status(204).json({
        status: 'success',
        data: null
    });
});


export const largestCommunites = catchAsync(async (req, res, next) => {
    const largeCommunities = await topLargestCommunites();

    res.status(200).json({
        status: 'success',
        data: largeCommunities
    });
});


export const mostActiveCommunities = catchAsync(async (req, res, next) => {
    const queryString = req.query;

    const mostActiveCommunities = await topMostActiveCommunities(queryString);

    res.status(200).json({
        status: 'success',
        data: mostActiveCommunities
    });
});

export const myCommunities = catchAsync(async (req, res, next) => {
    const userId = req.userId;

    const myCommunities = await getMyCommunities(userId);

    res.status(200).json({
        status: 'success',
        data: myCommunities
    });
});