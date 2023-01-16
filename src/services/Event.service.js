import { prisma } from '../db.js';

import { CommunityService } from './Community.service.js';

import { ok, failure } from '../utils/SendResponse.util.js';

export const EventService = {
    getAllEvents: async () => {
        const allEvents = await prisma.event.findMany({
            where: {
                eventTime: {
                    gte: new Date(),
                },
            },
            orderBy: {
                eventTime: 'asc',
            },
            select: {
                id: true,
                name: true,
                description: true,
                location: true,
                eventTime: true,
                eventOrganizer: true,
                communityId: true,
            },
        });

        return ok(allEvents);
    },

    getEventsByCommunityId: async (communityId) => {
        const community = await CommunityService.getCommunityById(communityId);

        if (!community) return failure('No community found with that ID.');

        const allEvents = await prisma.event.findMany({
            where: {
                AND: [
                    {
                        eventTime: {
                            gte: new Date(),
                        },
                    },
                    { communityId: communityId },
                ],
            },
            orderBy: {
                eventTime: 'asc',
            },
            select: {
                id: true,
                name: true,
                description: true,
                location: true,
                eventTime: true,
                eventOrganizer: true,
                communityId: true,
            },
        });

        return ok(allEvents);
    },

    createNewEvent: async (payload, communityId, eventOrganizer) => {
        const { name, description, location, eventTime } = payload;

        const newEvent = await prisma.event.create({
            data: {
                name,
                description,
                location,
                eventTime,
                eventOrganizer,
                communityId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                location: true,
                eventTime: true,
                eventOrganizer: true,
                communityId: true,
            },
        });

        return ok(newEvent, 201);
    },

    getMyEvents: async (userId) => {
        const myEvents = await prisma.event.findMany({
            where: {
                eventOrganizer: userId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                location: true,
                eventTime: true,
                eventOrganizer: true,
                communityId: true,
            },
        });

        return ok(myEvents);
    },

    getSubscribedEvents: async (userId) => {
        const subscribedEvents = await prisma.event.findMany({
            where: {
                eventTime: {
                    gte: new Date(),
                },
                subscribers: {
                    some: {
                        subscriberId: userId,
                    },
                },
            },
            orderBy: {
                eventTime: 'asc',
            },
            select: {
                id: true,
                name: true,
                description: true,
                location: true,
                eventTime: true,
                eventOrganizer: true,
                communityId: true,
            },
        });

        return ok(subscribedEvents);
    },

    getEventById: async (id) => {
        return prisma.event.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                description: true,
                location: true,
                eventTime: true,
                eventOrganizer: true,
                communityId: true,
            },
        });
    },

    getEvent: async (id) => {
        const event = await EventService.getEventById(id);

        if (!event) return failure('No event found with that ID.');

        return ok(event);
    },

    updateEventbyId: async (payload, id) => {
        const { name, description, location, eventTime } = payload;

        const event = await EventService.getEventById(id);

        if (!event) return failure('No event found with that ID.');

        const updatedEvent = await prisma.event.update({
            where: {
                id,
            },
            data: {
                name,
                description,
                location,
                eventTime,
            },
            select: {
                id: true,
                name: true,
                description: true,
                location: true,
                eventTime: true,
                eventOrganizer: true,
                communityId: true,
            },
        });

        return ok(updatedEvent);
    },

    deleteEventbyId: async (id) => {
        const event = await EventService.getEventById(id);

        if (!event) return failure('No event found with that ID.');

        const deletedEvent = await prisma.event.delete({
            where: {
                id,
            },
        });

        return ok(deletedEvent, 204);
    },

    subscribeEvent: async (eventId, subscriberId) => {
        const event = await EventService.getEventById(eventId);

        if (!event) return failure('No event found with that ID.');

        const userEvent = await EventService.isUserSubscribed(subscriberId, eventId);

        if (userEvent) return failure('You are already subscribed to this event.', 400);

        const subscribedEvent = await prisma.eventSubscribers.create({
            data: {
                eventId,
                subscriberId,
            },
        });

        return ok(subscribedEvent);
    },

    unsubscribeEvent: async (eventId, subscriberId) => {
        const event = await EventService.getEventById(eventId);

        if (!event) return failure('No event found with that ID.');

        const userEvent = await EventService.isUserSubscribed(subscriberId, eventId);

        if (!userEvent) return failure("You aren't subscribed to this event.", 400);

        const unsubscribedEvent = await prisma.eventSubscribers.delete({
            where: {
                eventSubscribers: { eventId, subscriberId },
            },
        });

        return ok(unsubscribedEvent);
    },

    getAllEventSubscribers: async (eventId) => {
        const event = await EventService.getEventById(eventId);

        if (!event) return failure('No event found with that ID.');

        const subscribers = await prisma.user.findMany({
            where: {
                subscriptions: {
                    some: {
                        eventId,
                    },
                },
            },
            select: {
                id: true,
                email: true,
                fullName: true,
            },
        });

        return ok(subscribers);
    },

    isUserSubscribed: async (subscriberId, eventId) => {
        return prisma.eventSubscribers.findUnique({
            where: {
                eventSubscribers: { eventId, subscriberId },
            },
        });
    },
};
