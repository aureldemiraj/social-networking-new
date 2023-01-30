import { PrismaClient } from '@prisma/client';

export const { community, event, eventSubscribers, post, user, usersOnCommunities } = new PrismaClient();
