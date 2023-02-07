import { NextFunction, Response, Router } from 'express';

import { RequestWithData } from '../interfaces/Auth.interface';

import { restrictTo } from '../middlewares/Auth.middleware';

import { CommunityService } from '../services/Community.service';
import { EventService } from '../services/Event.service';
import { UserService } from '../services/User.service';

import { catchAsync } from '../utils/CatchAsync.util';

export const MeController = Router();

MeController.use(restrictTo('USER', 'ADMIN'));

MeController.get(
    '/',
    catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
        const { userId } = req;

        const result = await UserService.getUser(userId);

        res.status(result.status).send(result.data);
    })
);

MeController.delete(
    '/',
    catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
        const { userId } = req;

        const result = await UserService.deleteUserById(userId);

        res.status(result.status).send(result.data);
    })
);

MeController.get(
    '/communities',
    catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
        const { userId } = req;

        const result = await CommunityService.getMyCommunities(userId);

        res.status(result.status).send(result.data);
    })
);

MeController.get(
    '/events',
    catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
        const { userId } = req;

        const result = await EventService.getMyEvents(userId);

        res.status(result.status).send(result.data);
    })
);

MeController.get(
    '/subscribed-events',
    catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
        const { userId } = req;

        const result = await EventService.getSubscribedEvents(userId);

        res.status(result.status).send(result.data);
    })
);
