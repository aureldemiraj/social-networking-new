import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllPosts = async (communityId) => {
    let filters = {};

    if (communityId) {
        filters = {
            where: { communityId }
        };
    }

    const allPosts = await prisma.post.findMany(filters);

    return allPosts;
}

export const createNewPost = async (payload, communityId, authorId) => {
    const { title, body } = payload;

    const newPost = await prisma.post.create({
        data: {
            title,
            body,
            authorId,
            communityId
        }
    })

    return newPost
}

export const getPostById = async (id) => {
    const post = await prisma.post.findUnique({
        where: {
            id
        }
    });

    return post
}

export const updatePostbyId = async (payload, id) => {
    const { title, body } = payload;

    const updatedPost = await prisma.post.update({
        where: {
            id
        },
        data: {
            title,
            body,
        }
    });

    return updatedPost
}

export const deletePostbyId = async (id) => {

    const post = await prisma.post.delete({
        where: {
            id
        }
    })

    return post
}