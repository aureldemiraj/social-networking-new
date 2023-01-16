import { prisma } from '../db.js';

import { ok, failure } from '../utils/SendResponse.util.js';

export const CommunityService = {
    getAllCommunities: async () => {
        const allCommunities = await prisma.community.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        return ok(allCommunities);
    },

    createNewCommunity: async (name, description) => {
        const oldCommunity = await CommunityService.getCommunityByName(name);

        if (oldCommunity) return failure('This community already exists.', 400);

        const newCommunity = await prisma.community.create({
            data: {
                name,
                description,
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        return ok(newCommunity, 201);
    },

    getCommunity: async (communityId) => {
        const community = await prisma.community.findUnique({
            where: {
                id: communityId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                posts: {
                    orderBy: {
                        createdTime: 'desc',
                    },
                    select: {
                        id: true,
                        title: true,
                        body: true,
                    },
                    take: 3,
                },
            },
        });

        if (!community) return failure('No community found with that ID.');

        return ok(community);
    },

    deleteCommunityById: async (communityId) => {
        const community = await CommunityService.getCommunityById(communityId);

        if (!community) return failure('No community found with that ID.');

        const deletedCommunity = await prisma.community.delete({
            where: {
                id: communityId,
            },
        });

        return ok(deletedCommunity, 204);
    },

    joinCommunity: async (userId, communityId) => {
        const community = await CommunityService.getCommunityById(communityId);

        if (!community) return failure('No community found with that ID.');

        const userInCommunity = await CommunityService.isUserJoined(userId, communityId);

        if (userInCommunity) return failure('You are already joined in this community.', 400);

        const joinedUser = await prisma.usersOnCommunities.create({
            data: {
                userId,
                communityId,
            },
            select: {
                communityId: true,
                userId: true,
                joinedAt: true,
            },
        });

        return ok(joinedUser);
    },

    leaveCommunity: async (userId, communityId) => {
        const community = await CommunityService.getCommunityById(communityId);

        if (!community) return failure('No community found with that ID.');

        const userInCommunity = await CommunityService.isUserJoined(userId, communityId);

        if (!userInCommunity) return failure('You are not joined in this community.', 400);

        const leaveCommunity = await prisma.usersOnCommunities.delete({
            where: {
                communityUsers: { userId, communityId },
            },
            select: {
                communityId: true,
                userId: true,
                joinedAt: true,
            },
        });

        return ok(leaveCommunity, 204);
    },

    getMyCommunities: async (userId) => {
        const myCommunities = await prisma.community.findMany({
            where: {
                users: {
                    some: {
                        userId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        return ok(myCommunities);
    },

    topMostActiveCommunities: async (queryString) => {
        let filters = {};

        if (queryString.lastDays) {
            const todayDate = new Date();
            const firstDate = new Date(Date.now() - parseInt(queryString.lastDays) * 24 * 60 * 60 * 1000);

            filters = {
                createdTime: {
                    lte: todayDate,
                    gte: firstDate,
                },
            };
        }

        const mostActiveCommunities = await prisma.post.groupBy({
            where: filters,
            by: ['communityId'],
            _count: {
                _all: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 3,
        });

        const idsOfCommunities = mostActiveCommunities.map((el) => el.communityId);

        const mostActiveCommunitiesDetails = await prisma.community.findMany({
            where: {
                id: {
                    in: idsOfCommunities,
                },
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        return ok(mostActiveCommunitiesDetails);
    },

    topLargestCommunities: async () => {
        const largestCommunities = await prisma.usersOnCommunities.groupBy({
            by: ['communityId'],
            _count: {
                _all: true,
            },
            orderBy: {
                _count: {
                    userId: 'desc',
                },
            },
            take: 3,
        });

        const idsOfCommunities = largestCommunities.map((el) => el.communityId);

        const largestCommunitiesDetails = await prisma.community.findMany({
            where: {
                id: {
                    in: idsOfCommunities,
                },
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        return ok(largestCommunitiesDetails);
    },

    getCommunityById: async (id) => {
        return prisma.community.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
    },

    getCommunityByName: async (name) => {
        return prisma.community.findUnique({
            where: {
                name,
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
    },

    isUserJoined: async (userId, communityId) => {
        return prisma.usersOnCommunities.findUnique({
            where: {
                communityUsers: { userId, communityId },
            },
            select: {
                communityId: true,
                userId: true,
            },
        });
    },
};
