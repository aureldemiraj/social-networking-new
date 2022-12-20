import { Router } from 'express';
import { catchAsync } from '../utils/CatchAsync.util.js';
import { CommunityService } from '../services/Community.service.js';
import { EventService } from '../services/Event.service.js';
import { PostService } from '../services/Post.service.js';
import { restrictTo } from '../middlewares/Auth.middleware.js';
import { checkIfJoined } from '../middlewares/CheckIfJoined.middleware.js';
import { CreateCommunityRequest, CreateEventRequest, CreatePostRequest } from '../validators/index.js';

export const CommunityController = Router();

CommunityController.get(
    '/',
    catchAsync(async (req, res, next) => {
        const result = await CommunityService.getAllCommunities();

        res.status(result.status).send(result.data);
    })
);

CommunityController.post(
    '/',
    restrictTo('ADMIN'),
    catchAsync(async (req, res, next) => {
        const { name, description } = await CreateCommunityRequest.validateAsync(req.body);

        const result = await CommunityService.createNewCommunity(name, description);

        res.status(result.status).send(result.data);
    })
);

CommunityController.get(
    '/most-active-communities',
    catchAsync(async (req, res, next) => {
        const queryString = req.query;

        const result = await CommunityService.topMostActiveCommunities(queryString);

        res.status(result.status).send(result.data);
    })
);

CommunityController.get(
    '/largest-communities',
    catchAsync(async (req, res, next) => {
        const result = await CommunityService.topLargestCommunities();

        res.status(result.status).send(result.data);
    })
);

CommunityController.get(
    '/:communityId',
    restrictTo('USER', 'ADMIN'),
    catchAsync(async (req, res, next) => {
        const { communityId } = req.params;

        const result = await CommunityService.getCommunity(communityId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.delete(
    '/:communityId',
    restrictTo('ADMIN'),
    catchAsync(async (req, res, next) => {
        const { communityId } = req.params;

        const result = await CommunityService.deleteCommunityById(communityId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.post(
    '/:communityId/join',
    restrictTo('USER', 'ADMIN'),
    catchAsync(async (req, res, next) => {
        const { communityId } = req.params;
        const { userId } = req;

        const result = await CommunityService.joinCommunity(userId, communityId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.post(
    '/:communityId/leave',
    restrictTo('USER', 'ADMIN'),
    catchAsync(async (req, res, next) => {
        const { communityId } = req.params;
        const { userId } = req;

        const result = await CommunityService.leaveCommunity(userId, communityId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.get(
    '/:communityId/events',
    restrictTo('USER', 'ADMIN'),
    catchAsync(async (req, res, next) => {
        const { communityId } = req.params;

        const result = await EventService.getEventsByCommunityId(communityId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.post(
    '/:communityId/events',
    restrictTo('USER', 'ADMIN'),
    checkIfJoined,
    catchAsync(async (req, res, next) => {
        const { communityId } = req.params;
        const { userId } = req;
        const payload = await CreateEventRequest.validateAsync(req.body);

        const result = await EventService.createNewEvent(payload, communityId, userId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.get(
    '/:communityId/posts',
    restrictTo('USER', 'ADMIN'),
    checkIfJoined,
    catchAsync(async (req, res, next) => {
        const { communityId } = req.params;

        const result = await PostService.getAllPosts(communityId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.post(
    '/:communityId/posts',
    restrictTo('USER', 'ADMIN'),
    checkIfJoined,
    catchAsync(async (req, res, next) => {
        const { communityId } = req.params;
        const authorId = req.userId;

        const payload = await CreatePostRequest.validateAsync(req.body);

        const result = await PostService.createNewPost(payload, communityId, authorId);

        res.status(result.status).send(result.data);
    })
);
