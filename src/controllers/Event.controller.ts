import { NextFunction, Request, Response, Router } from 'express';

import { RequestWithData } from '../interfaces/Auth.interface';

import { restrictTo } from '../middlewares/Auth.middleware';
import { checkEventOrganizer } from '../middlewares/CheckEventOrganizer.middleware';
import { validate } from '../middlewares/Validation.middleware';

import { EventService } from '../services/Event.service';

import { catchAsync } from '../utils/CatchAsync.util';

import { CreateEventValidator } from '../validators/index';

export const EventController = Router();

EventController.use(restrictTo('USER', 'ADMIN'));

EventController.get(
    '/',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await EventService.getAllEvents();

        res.status(result.status).send(result.data);
    })
);

EventController.get(
    '/:eventId',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { eventId } = req.params;

        const result = await EventService.getEvent(eventId);

        res.status(result.status).send(result.data);
    })
);

EventController.put(
    '/:eventId',
    checkEventOrganizer,
    validate(CreateEventValidator),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { eventId } = req.params;
        const result = await EventService.updateEventbyId(req.body, eventId);

        res.status(result.status).send(result.data);
    })
);

EventController.delete(
    '/:eventId',
    checkEventOrganizer,
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { eventId } = req.params;

        const result = await EventService.deleteEventbyId(eventId);

        res.status(result.status).send(result.data);
    })
);

EventController.post(
    '/:eventId/subscribe',
    catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
        const { eventId } = req.params;
        const { userId } = req;

        const result = await EventService.subscribeEvent(eventId, userId);

        res.status(result.status).send(result.data);
    })
);

EventController.post(
    '/:eventId/unsubscribe',
    catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
        const { eventId } = req.params;
        const { userId } = req;

        const result = await EventService.unsubscribeEvent(eventId, userId);

        res.status(result.status).send(result.data);
    })
);

EventController.get(
    '/:eventId/subscribers',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { eventId } = req.params;

        const result = await EventService.getAllEventSubscribers(eventId);

        res.status(result.status).send(result.data);
    })
);
