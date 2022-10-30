import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getCurrentUser = async (id) => {
    const currentUser = await prisma.user.findUnique({
        where: {
            id
        },
        // I will use it to check if user is joined in a community to let him create post or event
        include: {
            communities: {
                select: {
                    communityId: true
                }
            }
        }
    })

    return currentUser
}

export const getUserbyEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    return user
}

export const getUserbyId = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            birthDate: true,
            education: true
        }
    })

    return user
}

export const createNewUser = async (payload, encryptedPassword) => {
    const { email, fullName, birthDate, education } = payload;

    const newUser = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            fullName,
            password: encryptedPassword,
            birthDate,
            education
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            birthDate: true,
            education: true
        }
    })

    return newUser
}