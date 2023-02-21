import { PrismaClient } from '@prisma/client';

export const {
    community: CommunityModel,
    event: EventModel,
    eventSubscribers: EventSubscribersModel,
    post: PostModel,
    user: UserModel,
    usersOnCommunities: UsersOnCommunitiesModel,
} = new PrismaClient();
