import { prisma } from '../db.js';

import { CommunityService } from './Community.service.js';

import { ok, failure } from '../utils/SendResponse.util.js';

export const PostService = {
    getAllPosts: async (communityId) => {
        const community = await CommunityService.getCommunityById(communityId);

        if (!community) return failure('No community found with that ID.');

        const allPosts = await prisma.post.findMany({
            where: {
                communityId,
            },
            select: {
                id: true,
                title: true,
                body: true,
                authorId: true,
                communityId: true,
            },
        });

        return ok(allPosts);
    },

    createNewPost: async (payload, communityId, authorId) => {
        const community = await CommunityService.getCommunityById(communityId);

        if (!community) return failure('No community found with that ID.');

        const { title, body } = payload;

        const newPost = await prisma.post.create({
            data: {
                title,
                body,
                authorId,
                communityId,
            },
            select: {
                id: true,
                title: true,
                body: true,
                authorId: true,
                communityId: true,
            },
        });

        return ok(newPost, 201);
    },

    getPostById: async (id) => {
        const post = PostService.getPost(id);

        if (!post) return failure('No post found with that ID');

        return ok(post);
    },

    getPost: async (id) => {
        return prisma.post.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                title: true,
                body: true,
                authorId: true,
                communityId: true,
            },
        });
    },

    updatePostbyId: async (payload, id) => {
        const { title, body } = payload;

        const updatedPost = await prisma.post.update({
            where: {
                id,
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
                communityId: true,
            },
        });

        if (!updatedPost) return failure('No post found with that ID');

        return ok(updatedPost);
    },

    deletePostbyId: async (id) => {
        const post = await prisma.post.delete({
            where: {
                id,
            },
            select: {
                id: true,
                title: true,
                body: true,
                authorId: true,
                communityId: true,
            },
        });

        if (!post) return failure('No post found with that ID');

        return ok(post);
    },
};
