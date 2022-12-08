import express from 'express';
import { catchAsync } from '../utils/CatchAsync.util.js';
import { EventService } from '../services/Event.service.js';
import { restrictTo } from '../middlewares/Auth.middleware.js';
import { checkEventOrganizer } from '../middlewares/CheckEventOrganizer.middleware.js';
import { CreateEventRequest } from '../validators/index.js';

export const EventController = express.Router();

EventController.use(restrictTo('USER', 'ADMIN'));

EventController.get(
    '/',
    catchAsync(async (req, res, next) => {
        const result = await EventService.getAllEvents();

        res.status(result.status).send(result.data);
    })
);

EventController.get(
    '/:eventId',
    catchAsync(async (req, res, next) => {
        const { eventId } = req.params;

        const result = await EventService.getEvent(eventId);

        res.status(result.status).send(result.data);
    })
);

EventController.put(
    '/:eventId',
    checkEventOrganizer,
    catchAsync(async (req, res, next) => {
        const { eventId } = req.params;
        const payload = await CreateEventRequest.validateAsync(req.body);

        const result = await EventService.updateEventbyId(payload, eventId);

        res.status(result.status).send(result.data);
    })
);

EventController.delete(
    '/:eventId',
    checkEventOrganizer,
    catchAsync(async (req, res, next) => {
        const { eventId } = req.params;

        const result = await EventService.deleteEventbyId(eventId);

        res.status(result.status).send(result.data);
    })
);

EventController.post(
    '/:eventId/subscribe',
    catchAsync(async (req, res, next) => {
        const { eventId } = req.params;
        const { userId } = req;

        const result = await EventService.subscribeEvent(eventId, userId);

        res.status(result.status).send(result.data);
    })
);

EventController.post(
    '/:eventId/unsubscribe',
    catchAsync(async (req, res, next) => {
        const { eventId } = req.params;
        const { userId } = req;

        const result = await EventService.unsubscribeEvent(eventId, userId);

        res.status(result.status).send(result.data);
    })
);

EventController.get(
    '/:eventId/subscribers',
    catchAsync(async (req, res, next) => {
        const { eventId } = req.params;

        const result = await EventService.getAllEventSubscribers(eventId);

        res.status(result.status).send(result.data);
    })
);
