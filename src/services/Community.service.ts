import { community, post, usersOnCommunities } from '../config/db';

import { CommunityInterface } from '../interfaces/Community.interface';

import { failure, ok } from '../utils/SendResponse.util';

export const CommunityService = {
    getAllCommunities: async () => {
        const allCommunities = await community.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        return ok(allCommunities);
    },

    createNewCommunity: async (name: string, description: string) => {
        const oldCommunity = await CommunityService.getCommunityByName(name);

        if (oldCommunity) return failure('This community already exists.', 400);

        const newCommunity = await community.create({
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

    getCommunity: async (communityId: string) => {
        const communityFound = await community.findUnique({
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

        if (!communityFound) return failure('No community found with that ID.');

        return ok(communityFound);
    },

    deleteCommunityById: async (communityId: string) => {
        const communityFound = await CommunityService.getCommunityById(communityId);

        if (!communityFound) return failure('No community found with that ID.');

        const deletedCommunity = await community.delete({
            where: {
                id: communityId,
            },
        });

        return ok(deletedCommunity, 204);
    },

    joinCommunity: async (userId: string, communityId: string) => {
        const community = await CommunityService.getCommunityById(communityId);

        if (!community) return failure('No community found with that ID.');

        const userInCommunity = await CommunityService.isUserJoined(userId, communityId);

        if (userInCommunity) return failure('You are already joined in this community.', 400);

        const joinedUser = await usersOnCommunities.create({
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

    leaveCommunity: async (userId: string, communityId: string) => {
        const community = await CommunityService.getCommunityById(communityId);

        if (!community) return failure('No community found with that ID.');

        const userInCommunity = await CommunityService.isUserJoined(userId, communityId);

        if (!userInCommunity) return failure('You are not joined in this community.', 400);

        const leaveCommunity = await usersOnCommunities.delete({
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

    getMyCommunities: async (userId: string) => {
        const myCommunities = await community.findMany({
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

    topMostActiveCommunities: async (queryString: Record<string, string>) => {
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

        const mostActiveCommunities = await post.groupBy({
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

        const mostActiveCommunitiesDetails = await community.findMany({
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
        const largestCommunities = await usersOnCommunities.groupBy({
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

        const largestCommunitiesDetails = await community.findMany({
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

    getCommunityById: async (id: string): Promise<CommunityInterface | null> => {
        return community.findUnique({
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

    getCommunityByName: async (name: string): Promise<CommunityInterface | null> => {
        return community.findUnique({
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

    isUserJoined: async (userId: string, communityId: string) => {
        return usersOnCommunities.findUnique({
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