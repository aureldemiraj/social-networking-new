import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export const updateEventbyId = async (payload, id) => {
    const { name, description, location, eventTime } = payload;

    const event = await prisma.event.update({
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

    return event
};

export const deleteEventbyId = async (id) => {
    const event = await prisma.event.delete({
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

export const subscribeEvent = async (eventId, participantId) => {
    const result = await prisma.eventParticipants.create({
        data: {
            eventId,
            participantId
        }
    });

    return result
};

export const unsubscribeEvent = async (eventId, participantId) => {
    const result = await prisma.eventParticipants.delete({
        where: {
            eventId_participantId: { eventId, participantId }
        }
    });

    return result
};

export const isUserSubscribed = async (userId, eventId) => {
    const isUserSubscribed = await prisma.eventParticipants.findUnique({
        where: {
            eventId_participantId: { eventId, userId }
        }
    });

    return isUserSubscribed
};

export const getAllEventSubscribers = async (eventId) => {
    const subscribers = await prisma.user.findMany({
        where: {
            participantIn: {
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
            participants: {
                some: {
                    participantId: userId
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