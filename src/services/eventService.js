import prisma from './../../db.js';

export const getAllEvents = async (communityId) => {
    const filters = [
        {
            eventTime: {
                gte: new Date()
            }
        }];

    if (communityId) {
        filters.push({ communityId: communityId })
    }

    const allEvents = await prisma.event.findMany({
        where: {
            AND: filters
        },
        orderBy: {
            eventTime: 'asc'
        },
        select: {
            id: true,
            name: true,
            description: true,
            location: true,
            eventTime: true,
            eventOrganizer: true,
            communityId: true,
        }
    });

    return allEvents
};

export const getEventById = async (id) => {
    const event = await prisma.event.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            description: true,
            location: true,
            eventTime: true,
            eventOrganizer: true,
            communityId: true
        }
    });

    return event
};

export const createNewEvent = async (payload, communityId, organizerId) => {
    const { name, description, location, eventTime } = payload;

    const newEvent = await prisma.event.create({
        data: {
            name,
            description,
            location,
            eventTime,
            eventOrganizer: organizerId,
            communityId: communityId
        },
        select: {
            id: true,
            name: true,
            description: true,
            location: true,
            eventTime: true,
            eventOrganizer: true,
            communityId: true
        }
    });

    return newEvent
};

export const updateEventbyId = async (payload, id) => {
    const { name, description, location, eventTime } = payload;

    const updatedEvent = await prisma.event.update({
        where: {
            id
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
            communityId: true
        }
    });

    return updatedEvent
};

export const deleteEventbyId = async (id) => {
    const deletedEvent = await prisma.event.delete({
        where: {
            id
        }
    });

    return deletedEvent
};

export const subscribeEvent = async (eventId, subscriberId) => {
    const subscribedEvent = await prisma.eventSubscribers.create({
        data: {
            eventId,
            subscriberId
        }
    });

    return subscribedEvent
};

export const unsubscribeEvent = async (eventId, subscriberId) => {
    const unsubscribedEvent = await prisma.eventSubscribers.delete({
        where: {
            eventSubscribers: { eventId, subscriberId }
        }
    });

    return unsubscribedEvent
};

export const isUserSubscribed = async (subscriberId, eventId) => {
    const isUserSubscribed = await prisma.eventSubscribers.findUnique({
        where: {
            eventSubscribers: { eventId, subscriberId }
        }
    });

    return isUserSubscribed
};

export const getAllEventSubscribers = async (eventId) => {
    const subscribers = await prisma.user.findMany({
        where: {
            subscriptions: {
                some: {
                    eventId
                }
            }
        },
        select: {
            id: true,
            email: true,
            fullName: true
        }
    });

    return subscribers
};

export const getMyEvents = async (userId) => {
    const myEvents = await prisma.event.findMany({
        where: {
            eventOrganizer: userId
        },
        select: {
            id: true,
            name: true,
            description: true,
            location: true,
            eventTime: true,
            eventOrganizer: true,
            communityId: true,
        }
    });

    return myEvents
}

export const getSubscribedEvents = async (userId) => {
    const subscribedEvents = await prisma.event.findMany({
        where: {
            eventTime: {
                gte: new Date()
            },
            subscribers: {
                some: {
                    subscriberId: userId
                }
            }
        },
        orderBy: {
            eventTime: 'asc'
        },
        select: {
            id: true,
            name: true,
            description: true,
            location: true,
            eventTime: true,
            eventOrganizer: true,
            communityId: true,
        }
    });

    return subscribedEvents
};