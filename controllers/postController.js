import { PrismaClient } from "@prisma/client";

import { catchAsync } from './../utils/catchAsync.js'
import AppError from './../utils/appError.js'

const prisma = new PrismaClient();

export const getPosts = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;
    let filter = {};

    if (communityId) {
        filter = {
            where: {
                communityId: communityId
            }
        }
    }

    const allPosts = await prisma.post.findMany(filter);

    res.status(200).json({
        status: 'success',
        results: allPosts.length,
        data: allPosts
    })
})

export const createPost = catchAsync(async (req, res, next) => {
    const { postTitle, postBody } = req.body;
    const communityId = req.params.communityId;
    const authorId = req.user.id;

    const newPost = await prisma.post.create({
        data: {
            title: postTitle,
            body: postBody,
            authorId: authorId,
            communityId: communityId
        }
    })

    res.status(201).json({
        status: 'success',
        data: newPost
    })
})

export const getPost = catchAsync(async (req, res, next) => {
    const postId = req.params.postId;

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })

    console.log(post.authorId)

    if (!post) {
        return next(new AppError('No post found with that ID', 400))
    }

    res.status(200).json({
        status: 'success',
        data: post
    })
})


export const updatePost = catchAsync(async (req, res, next) => {
    const postId = req.params.postId;
    const { postTitle, postBody } = req.body;

    const updatedPost = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            title: postTitle,
            body: postBody,
        }
    });

    res.status(200).json({
        status: 'success',
        data: updatedPost
    });
})

export const deletePost = catchAsync(async (req, res, next) => {
    const postId = req.params.postId;

    const post = await prisma.post.delete({
        where: {
            id: postId
        }
    })

    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
})