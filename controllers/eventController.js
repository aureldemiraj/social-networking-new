import { PrismaClient } from "@prisma/client";

import { catchAsync } from './../utils/catchAsync.js'
import AppError from './../utils/appError.js'

const prisma = new PrismaClient();

export const getEvents = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;
    let filter = {};

    if (communityId) {
        filter = {
            where: {
                communityId: communityId
            }
        }
    }

    const allEvents = await prisma.event.findMany(filter);

    res.status(200).json({
        status: 'success',
        results: allEvents.length,
        data: allEvents
    })
})

export const createEvent = catchAsync(async (req, res, next) => {
    const { eventName, eventDescription, eventLocation, eventTime } = req.body;
    const communityId = req.params.communityId;
    const organizerId = req.user.id;

    const newEvent = await prisma.event.create({
        data: {
            name: eventName,
            description: eventDescription,
            location: eventLocation,
            eventTime: eventTime,
            eventOrganizer: organizerId,
            communityId: communityId
        }
    })

    res.status(201).json({
        status: 'success',
        data: newEvent
    })
})

export const getEvent = catchAsync(async (req, res, next) => {
    const eventId = req.params.eventId;

    const event = await prisma.event.findUnique({
        where: {
            id: eventId
        }
    })

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
    const { eventName, eventDescription, eventLocation, eventTime } = req.body;

    const event = await prisma.event.update({
        where: {
            id: eventId
        },
        data: {
            name: eventName,
            description: eventDescription,
            location: eventLocation,
            eventTime: eventTime
        }
    });

    if (!event) {
        return next(new AppError('No event found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: event
    });
})


export const deleteEvent = catchAsync(async (req, res, next) => {
    const eventId = req.params.eventId;

    const event = await prisma.event.delete({
        where: {
            id: eventId
        }
    })

    if (!event) {
        return next(new AppError('No event found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
})
