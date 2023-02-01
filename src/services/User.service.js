import { prisma } from '../config/db';

import { ok, failure } from '../utils/SendResponse.util.js';

export const UserService = {
    getAllUsers: async () => {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                fullName: true,
                email: true,
                birthDate: true,
                education: true,
                role: true,
            },
        });

        return ok(users);
    },

    getUserbyId: async (id) => {
        return prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                birthDate: true,
                education: true,
            },
        });
    },

    getUser: async (id) => {
        const user = await UserService.getUserbyId(id);

        if (!user) return failure('No user found with that ID');

        return ok(user);
    },

    deleteUserById: async (userId) => {
        const deletedUser = await prisma.user.delete({
            where: {
                id: userId,
            },
        });

        if (!deletedUser) return failure('No user found with that ID');

        return ok(deletedUser);
    },
};
