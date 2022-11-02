import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkEventRequest = (payload) => {
    return payload.name && payload.description && payload.location && payload.eventTime
};

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
        }
    });

    return newEvent
};

export const getEventById = async (id) => {
    const event = await prisma.event.findUnique({
        where: {
            id
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
        }
    });

    return event
};

export const deleteEventbyId = async (id) => {
    const event = await prisma.event.delete({
        where: {
            id
        }
    });

    return event
};

export const goingToEvent = async (eventId, participantId) => {
    const result = await prisma.eventParticipants.create({
        data: {
            eventId,
            participantId
        }
    });

    return result
};

export const notGoingToEvent = async (eventId, participantId) => {
    const result = await prisma.eventParticipants.delete({
        where: {
            eventId_participantId: { eventId, participantId }
        }
    });

    return result
};

export const getAllEventParticipants = async (eventId) => {
    const result = await prisma.eventParticipants.findMany({
        where: {
            eventId
        },
        include: {
            participant: {
                select: {
                    id: true,
                    fullName: true
                }
            }
        }
    });

    return result
};

export const hasUserConfirmed = async (userId, eventId) => {
    const hasUserConfirmed = await prisma.eventParticipants.findUnique({
        where: {
            eventId_participantId: { eventId, userId }
        }
    });

    return hasUserConfirmed
};

export const getMyEvents = async (userId) => {
    const myEvents = await prisma.event.findMany({
        where: {
            eventOrganizer: userId
        },
        select: {
            id: true,
            name: true,
            location: true,
            eventTime: true,
            eventOrganizer: true,
            communityId: true,
        }
    });

    return myEvents
}

export const getSubscribedEvents = async (userId) => {
    const subscribedEvents = await prisma.eventParticipants.findMany({
        where: {
            participantId: userId
        },
        include: {
            event: {
                select: {
                    id: true,
                    name: true,
                    eventTime: true
                }
            }
        }
    });

    return subscribedEvents
};