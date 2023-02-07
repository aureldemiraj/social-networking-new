import { user } from '../config/db';

import { ok, failure } from '../utils/SendResponse.util';

export const UserService = {
    getAllUsers: async () => {
        const users = await user.findMany({
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

    getUserbyId: async (id: string) => {
        return user.findUnique({
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

    getUser: async (id: string) => {
        const user = await UserService.getUserbyId(id);

        if (!user) return failure('No user found with that ID');

        return ok(user);
    },

    deleteUserById: async (userId: string) => {
        const deletedUser = await user.delete({
            where: {
                id: userId,
            },
        });

        if (!deletedUser) return failure('No user found with that ID');

        return ok(deletedUser);
    },
};
