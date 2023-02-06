import { post } from '../config/db';

import { PostInterface } from '../interfaces/Post.interface';

import { CommunityService } from './Community.service';

import { ok, failure } from '../utils/SendResponse.util';

export const PostService = {
    getAllPosts: async (communityId: string) => {
        const community = await CommunityService.getCommunityById(communityId);

        if (!community) return failure('No community found with that ID.');

        const allPosts = await post.findMany({
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

    createNewPost: async (payload: PostInterface, communityId: string, authorId: string) => {
        const community = await CommunityService.getCommunityById(communityId);

        if (!community) return failure('No community found with that ID.');

        const { title, body } = payload;

        const newPost = await post.create({
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

    getPostById: async (id: string) => {
        const post = await PostService.getPost(id);

        if (!post) return failure('No post found with that ID');

        return ok(post);
    },

    getPost: async (id: string) => {
        return post.findUnique({
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

    updatePostbyId: async (payload: PostInterface, id: string) => {
        const { title, body } = payload;

        const updatedPost = await post.update({
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

    deletePostbyId: async (id: string) => {
        const postFound = await post.delete({
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

        if (!postFound) return failure('No post found with that ID');

        return ok(postFound);
    },
};
