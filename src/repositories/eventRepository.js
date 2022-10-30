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
        }
    });

    return allEvents
}

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
    })

    return newEvent
}

export const getEventById = async (id) => {
    const event = await prisma.event.findUnique({
        where: {
            id
        }
    });

    return event
}

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
}

export const deleteEventbyId = async (id) => {
    const event = await prisma.event.delete({
        where: {
            id
        }
    });

    return event
}