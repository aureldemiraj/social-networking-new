import { catchAsync } from './../common/catchAsync.js'
import AppError from './../common/appError.js'
import { createNewEvent, deleteEventbyId, getAllEvents, getEventById, updateEventbyId } from "../repositories/eventRepository.js";
import { checkEventRequest } from "../services/eventService.js";


export const getEvents = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;

    const allEvents = await getAllEvents(communityId);

    res.status(200).json({
        status: 'success',
        results: allEvents.length,
        data: allEvents
    })
})

export const createEvent = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;
    const organizerId = req.userId;
    const payload = req.body;

    if (!checkEventRequest(payload)) {
        return next(new AppError('Please fill in all required fields.', 400))
    }

    const newEvent = await createNewEvent(payload, communityId, organizerId)

    res.status(201).json({
        status: 'success',
        data: newEvent
    })
})

export const getEvent = catchAsync(async (req, res, next) => {
    const eventId = req.params.eventId;

    const event = await getEventById(eventId);

    if (!event) {
        return next(new AppError('No event found with that ID', 400))
    }

    res.status(200).json({
        status: 'success',
        data: event
    })
})

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
})


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
})
