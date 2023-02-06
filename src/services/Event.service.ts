import { event, eventSubscribers, user } from '../config/db';

import { EventInterface } from '../interfaces/Event.interface';

import { CommunityService } from './Community.service';

import { ok, failure } from '../utils/SendResponse.util';

export const EventService = {
    getAllEvents: async () => {
        const allEvents = await event.findMany({
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

    getEventsByCommunityId: async (communityId: string) => {
        const community = await CommunityService.getCommunityById(communityId);

        if (!community) return failure('No community found with that ID.');

        const allEvents = await event.findMany({
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

    createNewEvent: async (
        payload: Omit<EventInterface, 'eventOrganizer' | 'communityId'>,
        communityId: string,
        eventOrganizer: string
    ) => {
        const { name, description, location, eventTime } = payload;

        const newEvent = await event.create({
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

    getMyEvents: async (userId: string) => {
        const myEvents = await event.findMany({
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

    getSubscribedEvents: async (userId: string) => {
        const subscribedEvents = await event.findMany({
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

    getEventById: async (id: string): Promise<EventInterface | null> => {
        return event.findUnique({
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

    getEvent: async (id: string) => {
        const event = await EventService.getEventById(id);

        if (!event) return failure('No event found with that ID.');

        return ok(event);
    },

    updateEventbyId: async (payload: Omit<EventInterface, 'eventOrganizer' | 'communityId'>, id: string) => {
        const { name, description, location, eventTime } = payload;

        const eventFound = await EventService.getEventById(id);

        if (!eventFound) return failure('No event found with that ID.');

        const updatedEvent = await event.update({
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

    deleteEventbyId: async (id: string) => {
        const eventFound = await EventService.getEventById(id);

        if (!eventFound) return failure('No event found with that ID.');

        const deletedEvent = await event.delete({
            where: {
                id,
            },
        });

        return ok(deletedEvent, 204);
    },

    subscribeEvent: async (eventId: string, subscriberId: string) => {
        const eventFound = await EventService.getEventById(eventId);

        if (!eventFound) return failure('No event found with that ID.');

        const userEvent = await EventService.isUserSubscribed(subscriberId, eventId);

        if (userEvent) return failure('You are already subscribed to this event.', 400);

        const subscribedEvent = await eventSubscribers.create({
            data: {
                eventId,
                subscriberId,
            },
        });

        return ok(subscribedEvent);
    },

    unsubscribeEvent: async (eventId: string, subscriberId: string) => {
        const eventFound = await EventService.getEventById(eventId);

        if (!eventFound) return failure('No event found with that ID.');

        const userEvent = await EventService.isUserSubscribed(subscriberId, eventId);

        if (!userEvent) return failure("You aren't subscribed to this event.", 400);

        const unsubscribedEvent = await eventSubscribers.delete({
            where: {
                eventSubscribers: { eventId, subscriberId },
            },
        });

        return ok(unsubscribedEvent);
    },

    getAllEventSubscribers: async (eventId: string) => {
        const eventFound = await EventService.getEventById(eventId);

        if (!eventFound) return failure('No event found with that ID.');

        const subscribers = await user.findMany({
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

    isUserSubscribed: async (subscriberId: string, eventId: string) => {
        return eventSubscribers.findUnique({
            where: {
                eventSubscribers: { eventId, subscriberId },
            },
        });
    },
};
