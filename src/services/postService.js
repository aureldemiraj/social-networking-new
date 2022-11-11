import prisma from './../../db.js';

export const getAllPosts = async (communityId) => {
    let filters = {};

    if (communityId) {
        filters = {
            where: { communityId }
        };
    }

    const allPosts = await prisma.post.findMany({
        ...filters,
        select: {
            id: true,
            title: true,
            body: true,
            authorId: true,
            communityId: true
        }
    });

    return allPosts
};

export const getPostById = async (id) => {
    const post = await prisma.post.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            title: true,
            body: true,
            authorId: true,
            communityId: true
        }
    });

    return post
};

export const createNewPost = async (payload, communityId, authorId) => {
    const { title, body } = payload;

    const newPost = await prisma.post.create({
        data: {
            title,
            body,
            authorId,
            communityId
        },
        select: {
            id: true,
            title: true,
            body: true,
            authorId: true,
            communityId: true
        }
    });

    return newPost
};

export const updatePostbyId = async (payload, id) => {
    const { title, body } = payload;

    const updatedPost = await prisma.post.update({
        where: {
            id
        },
        data: {
            title,
            body,
        },
        select: {
            id: true,
            title: true,
            body: true,
            authorId: true,
            communityId: true
        }
    });

    return updatedPost
};

export const deletePostbyId = async (id) => {
    const post = await prisma.post.delete({
        where: {
            id
        },
        select: {
            id: true,
            title: true,
            body: true,
            authorId: true,
            communityId: true
        }
    });

    return post
};