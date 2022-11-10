// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

import prisma from './../../db.js';

export const getAllCommunities = async () => {
    const allCommunities = await prisma.community.findMany({
        select: {
            id: true,
            name: true,
            description: true
        },
    });

    return allCommunities
};

export const getCommunityByName = async (name) => {
    const community = await prisma.community.findUnique({
        where: {
            name
        },
        select: {
            id: true,
            name: true,
            description: true
        }
    });

    return community
};

export const createNewCommunity = async (payload) => {
    const { name, description } = payload;

    const newCommunity = await prisma.community.create({
        data: {
            name,
            description
        },
        select: {
            id: true,
            name: true,
            description: true
        }
    });

    return newCommunity
};

export const getCommunityById = async (id) => {
    const community = await prisma.community.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            description: true
        }
    });

    return community
};

export const joinCommunitybyId = async (userId, communityId) => {
    const joinedUser = await prisma.usersOnCommunities.create({
        data: {
            userId,
            communityId
        },
        select: {
            communityId: true,
            userId: true,
            joinedAt: true
        }
    });

    return joinedUser
};

export const leaveCommunitybyId = async (userId, communityId) => {
    const leaveCommunity = await prisma.usersOnCommunities.delete({
        where: {
            communityUsers: { userId, communityId }
        },
        select: {
            communityId: true,
            userId: true,
            joinedAt: true
        }
    });

    return leaveCommunity
};


export const topLargestCommunites = async () => {
    const largestCommunities = await prisma.usersOnCommunities.groupBy({
        by: ['communityId'],
        _count: {
            _all: true
        },
        orderBy: {
            _count: {
                userId: 'desc'
            }
        },
        take: 3
    });

    const idsOfCommunities = largestCommunities.map(el => el.communityId);

    const largestCommunitiesDetails = await prisma.community.findMany({
        where: {
            id: {
                in: idsOfCommunities
            }
        },
        select: {
            id: true,
            name: true,
            description: true
        }
    });

    return largestCommunitiesDetails
};

export const topMostActiveCommunities = async (queryString) => {
    let filters = {};

    if (queryString.lastDays) {
        const todayDate = new Date();
        const firstDate = new Date(Date.now() - (parseInt(queryString.lastDays) * 24 * 60 * 60 * 1000));

        filters = {
            createdTime: {
                lte: todayDate,
                gte: firstDate,
            }
        }
    }

    const mostActiveCommunities = await prisma.post.groupBy({
        where: filters,
        by: ['communityId'],
        _count: {
            _all: true
        },
        orderBy: {
            _count: {
                id: 'desc'
            }
        },
        take: 3
    });

    const idsOfCommunities = mostActiveCommunities.map(el => el.communityId);

    const mostActiveCommunitiesDetails = await prisma.community.findMany({
        where: {
            id: {
                in: idsOfCommunities
            }
        },
        select: {
            id: true,
            name: true,
            description: true
        }
    });

    return mostActiveCommunitiesDetails
};

export const isUserJoined = async (userId, communityId) => {
    const isUserJoined = await prisma.usersOnCommunities.findUnique({
        where: {
            communityUsers: { userId, communityId }
        },
        select: {
            communityId: true,
            userId: true
        }
    });

    return isUserJoined
};

export const getMyCommunities = async (userId) => {
    const myCommunities = await prisma.community.findMany({
        where: {
            users: {
                some: {
                    userId
                }
            }
        },
        select: {
            id: true,
            name: true,
            description: true
        },
    })

    return myCommunities
};

export const deleteCommunityById = async (communityId) => {
    const deletedCommunity = await prisma.community.delete({
        where: {
            id: communityId
        }
    });

    return deletedCommunity
}