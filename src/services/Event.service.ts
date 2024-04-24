import { EventModel, EventSubscribersModel, UserModel } from '../config/db';

import { EventInterface } from '../interfaces/Event.interface';

import { CommunityService } from './Community.service';

import { ok, failure } from '../utils/SendResponse.util';
import { EmitEntityEvent } from '../utils/EmitEntityEvent.util';

export const EventService = {
    getAllEvents: async () => {
        const allEvents = await EventModel.findMany({
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

        const allEvents = await EventModel.findMany({
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

        const newEvent = await EventModel.create({
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

        EmitEntityEvent('create', 'Event', newEvent);

        return ok(newEvent, 201);
    },

    getMyEvents: async (userId: string) => {
        const myEvents = await EventModel.findMany({
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
        const subscribedEvents = await EventModel.findMany({
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
        return EventModel.findUnique({
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

        const event = await EventService.getEventById(id);

        if (!event) return failure('No event found with that ID.');

        const updatedEvent = await EventModel.update({
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

        EmitEntityEvent('update', 'Event', updatedEvent);

        return ok(updatedEvent);
    },

    deleteEventbyId: async (id: string) => {
        const event = await EventService.getEventById(id);

        if (!event) return failure('No event found with that ID.');

        const deletedEvent = await EventModel.delete({
            where: {
                id,
            },
        });

        EmitEntityEvent('delete', 'Event', deletedEvent);

        return ok(deletedEvent, 204);
    },

    subscribeEvent: async (eventId: string, subscriberId: string) => {
        const event = await EventService.getEventById(eventId);

        if (!event) return failure('No event found with that ID.');

        const userEvent = await EventService.isUserSubscribed(subscriberId, eventId);

        if (userEvent) return failure('You are already subscribed to this event.', 400);

        const subscribedEvent = await EventSubscribersModel.create({
            data: {
                eventId,
                subscriberId,
            },
        });

        EmitEntityEvent('create', 'EventSubscriber', subscribedEvent);

        return ok(subscribedEvent);
    },

    unsubscribeEvent: async (eventId: string, subscriberId: string) => {
        const event = await EventService.getEventById(eventId);

        if (!event) return failure('No event found with that ID.');

        const userEvent = await EventService.isUserSubscribed(subscriberId, eventId);

        if (!userEvent) return failure("You aren't subscribed to this event.", 400);

        const unsubscribedEvent = await EventSubscribersModel.delete({
            where: {
                eventSubscribers: { eventId, subscriberId },
            },
        });

        EmitEntityEvent('delete', 'EventSubscriber', unsubscribedEvent);

        return ok(unsubscribedEvent);
    },

    getAllEventSubscribers: async (eventId: string) => {
        const event = await EventService.getEventById(eventId);

        if (!event) return failure('No event found with that ID.');

        const subscribers = await UserModel.findMany({
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
        return EventSubscribersModel.findUnique({
            where: {
                eventSubscribers: { eventId, subscriberId },
            },
        });
    },
};
