import { Router } from 'express';

import { restrictTo } from '../middlewares/Auth.middleware.js';

import { EventService } from '../services/Event.service.js';
import { CommunityService } from '../services/Community.service.js';
import { UserService } from '../services/User.service.js';

import { catchAsync } from '../utils/CatchAsync.util.js';

export const MeController = Router();

MeController.use(restrictTo('USER', 'ADMIN'));

MeController.get(
    '/',
    catchAsync(async (req, res, next) => {
        const { userId } = req;

        const result = await UserService.getUser(userId);

        res.status(result.status).send(result.data);
    })
);

MeController.delete(
    '/',
    catchAsync(async (req, res, next) => {
        const { userId } = req;

        const result = await UserService.deleteUserById(userId);

        res.status(result.status).send(result.data);
    })
);

MeController.get(
    '/communities',
    catchAsync(async (req, res, next) => {
        const { userId } = req;

        const result = await CommunityService.getMyCommunities(userId);

        res.status(result.status).send(result.data);
    })
);

MeController.get(
    '/events',
    catchAsync(async (req, res, next) => {
        const { userId } = req;

        const result = await EventService.getMyEvents(userId);

        res.status(result.status).send(result.data);
    })
);

MeController.get(
    '/subscribed-events',
    catchAsync(async (req, res, next) => {
        const { userId } = req;

        const result = await EventService.getSubscribedEvents(userId);

        res.status(result.status).send(result.data);
    })
);
