import { PrismaClient } from '@prisma/client';

import { catchAsync } from './../common/catchAsync.js'
import AppError from './../common/appError.js'

const prisma = new PrismaClient();

export const getAllCommunities = async () => {
    const allCommunities = await prisma.community.findMany({
        select: {
            id: true,
            name: true,
            description: true
        }
    });

    return allCommunities
};


export const getCommunityByName = async (name) => {
    const community = await prisma.community.findUnique({
        where: {
            name
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
}

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
    })

    return community
}

export const joinCommunitybyId = async (userId, communityId) => {
    const joinedUser = await prisma.usersOnCommunities.create({
        data: {
            userId,
            communityId
        }
    })

    return joinedUser
}

export const leaveCommunitybyId = async (userId, communityId) => {
    const goneUser = await prisma.usersOnCommunities.delete({
        where: {
            communityUsers: { userId, communityId }
        }
    })

    return goneUser
}


export const topLargestCommunites = async () => {

    const largeCommunities = await prisma.usersOnCommunities.groupBy({
        by: ['communityId'],
        _count: {
            _all: true
        },
        orderBy: {
            _count: {
                userId: 'desc'
            }
        },
        take: 10
    })

    const idsOfCommunities = largeCommunities.map(el => el.communityId)

    const result = await prisma.community.findMany({
        where: {
            id: {
                in: idsOfCommunities
            }
        }
    })

    return result
}

export const topMostActiveCommunities = async () => {
    const mostActiveCommunities = await prisma.post.groupBy({
        by: ['communityId'],
        _count: {
            _all: true
        },
        orderBy: {
            _count: {
                id: 'desc'
            }
        },
        take: 10
    })

    const idsOfCommunities = mostActiveCommunities.map(el => el.communityId);

    const result = await prisma.community.findMany({
        where: {
            id: {
                in: idsOfCommunities
            }
        }
    })

    return result
}

export const getUserCommunities = async (userId) => {

    const communities = await prisma.usersOnCommunities.findMany({
        where: {
            userId: userId
        },
        select: {
            communityId: true
        }
    });

    return communities
}