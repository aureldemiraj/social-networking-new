import { catchAsync } from './../common/catchAsync.js';
import AppError from './../common/appError.js';
import {
    createNewEvent,
    deleteEventbyId,
    getAllEvents,
    getEventById,
    updateEventbyId,
    goingToEvent,
    notGoingToEvent,
    getAllEventParticipants,
    checkEventRequest,
    hasUserConfirmed,
    getMyEvents,
    getSubscribedEvents
} from "../services/eventService.js";


export const getEvents = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;

    const allEvents = await getAllEvents(communityId);

    res.status(200).json({
        status: 'success',
        results: allEvents.length,
        data: allEvents
    });
});

export const createEvent = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;
    const organizerId = req.userId;
    const payload = req.body;

    if (!checkEventRequest(payload)) {
        return next(new AppError('Please fill in all required fields.', 400))
    }

    const newEvent = await createNewEvent(payload, communityId, organizerId);

    res.status(201).json({
        status: 'success',
        data: newEvent
    });
});

export const getEvent = catchAsync(async (req, res, next) => {
    const eventId = req.params.eventId;

    const event = await getEventById(eventId);

    if (!event) {
        return next(new AppError('No event found with that ID', 400))
    }

    res.status(200).json({
        status: 'success',
        data: event
    });
});

export const updateEvent = catchAsync(async (req, res, next) => {
    const eventId = req.params.eventId;
    const payload = req.body;

    if (!checkEventRequest(payload)) {
        return next(new AppError('Please fill in all required fields.', 400))
    }

    const updatedEvent = await updateEventbyId(payload, eventId);

    if (!updatedEvent) {
        return next(new AppError('No event found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: updatedEvent
    });
});


export const deleteEvent = catchAsync(async (req, res, next) => {
    const eventId = req.params.eventId;

    const event = await deleteEventbyId(eventId);

    if (!event) {
        return next(new AppError('No event found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

export const confirmGoing = catchAsync(async (req, res, next) => {
    const eventId = req.params.eventId;
    const userId = req.userId;

    const event = await getEventById(eventId);

    if (!event) {
        return next(new AppError('No event found with that ID', 404))
    }

    const userConfirmed = await hasUserConfirmed(userId, eventId);

    if (userConfirmed) {
        return next(new AppError('You have already confirm.', 400))
    }

    const result = await goingToEvent(eventId, userId);

    res.status(200).json({
        status: 'success',
        data: result
    });
});

export const cancelConfirmation = catchAsync(async (req, res, next) => {
    const eventId = req.params.eventId;
    const userId = req.userId;

    const event = await getEventById(eventId);

    if (!event) {
        return next(new AppError('No event found with that ID', 404))
    }

    const userConfirmed = await hasUserConfirmed(userId, eventId);

    if (!userConfirmed) {
        return next(new AppError('You have not confirmed yet.', 400))
    }

    const result = await notGoingToEvent(eventId, userId);

    res.status(200).json({
        status: 'success',
        data: result
    });
});

export const getEventParticipants = catchAsync(async (req, res, next) => {
    const eventId = req.params.eventId;

    const event = await getEventById(eventId);

    if (!event) {
        return next(new AppError('No event found with that ID', 404))
    }

    const result = await getAllEventParticipants(eventId);

    res.status(200).json({
        status: 'success',
        data: result
    });
});

export const myEvents = catchAsync(async (req, res, next) => {
    const userId = req.userId;
    const myEvents = await getMyEvents(userId);

    res.status(200).json({
        status: 'success',
        data: myEvents
    })
});

export const subscribedEvents = catchAsync(async (req, res, next) => {
    const userId = req.userId;

    const subscribedEvents = await getSubscribedEvents(userId);

    res.status(200).json({
        status: 'success',
        data: subscribedEvents
    })
});