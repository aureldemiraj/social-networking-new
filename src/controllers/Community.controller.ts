import { NextFunction, Request, Response, Router } from 'express';

import { RequestWithData } from '../interfaces/Auth.interface';

import { restrictTo } from '../middlewares/Auth.middleware';
import { checkIfJoined } from '../middlewares/CheckIfJoined.middleware';
import { validate } from '../middlewares/Validation.middleware';

import { CommunityService } from '../services/Community.service';
import { EventService } from '../services/Event.service';
import { PostService } from '../services/Post.service';

import { catchAsync } from '../utils/CatchAsync.util';

import { CreateCommunityValidator, CreateEventValidator, CreatePostValidator } from '../validators/index';

export const CommunityController = Router();

CommunityController.get(
    '/',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await CommunityService.getAllCommunities();

        res.status(result.status).send(result.data);
    })
);

CommunityController.post(
    '/',
    restrictTo('ADMIN'),
    validate(CreateCommunityValidator),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { name, description } = req.body;

        const result = await CommunityService.createNewCommunity(name, description);

        res.status(result.status).send(result.data);
    })
);

CommunityController.get(
    '/most-active-communities',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const queryString = req.query as Record<string, string>;

        const result = await CommunityService.topMostActiveCommunities(queryString);

        res.status(result.status).send(result.data);
    })
);

CommunityController.get(
    '/largest-communities',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await CommunityService.topLargestCommunities();

        res.status(result.status).send(result.data);
    })
);

CommunityController.get(
    '/:communityId',
    restrictTo('USER', 'ADMIN'),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { communityId } = req.params;

        const result = await CommunityService.getCommunity(communityId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.delete(
    '/:communityId',
    restrictTo('ADMIN'),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { communityId } = req.params;

        const result = await CommunityService.deleteCommunityById(communityId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.post(
    '/:communityId/join',
    restrictTo('USER', 'ADMIN'),
    catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
        const { communityId } = req.params;
        const { userId } = req;

        const result = await CommunityService.joinCommunity(userId, communityId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.post(
    '/:communityId/leave',
    restrictTo('USER', 'ADMIN'),
    catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
        const { communityId } = req.params;
        const { userId } = req;

        const result = await CommunityService.leaveCommunity(userId, communityId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.get(
    '/:communityId/events',
    restrictTo('USER', 'ADMIN'),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { communityId } = req.params;

        const result = await EventService.getEventsByCommunityId(communityId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.post(
    '/:communityId/events',
    restrictTo('USER', 'ADMIN'),
    checkIfJoined,
    validate(CreateEventValidator),
    catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
        const { communityId } = req.params;
        const { userId } = req;

        const result = await EventService.createNewEvent(req.body, communityId, userId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.get(
    '/:communityId/posts',
    restrictTo('USER', 'ADMIN'),
    checkIfJoined,
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { communityId } = req.params;

        const result = await PostService.getAllPosts(communityId);

        res.status(result.status).send(result.data);
    })
);

CommunityController.post(
    '/:communityId/posts',
    restrictTo('USER', 'ADMIN'),
    checkIfJoined,
    validate(CreatePostValidator),
    catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
        const { communityId } = req.params;
        const authorId = req.userId;

        const result = await PostService.createNewPost(req.body, communityId, authorId);

        res.status(result.status).send(result.data);
    })
);
