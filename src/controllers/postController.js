import { catchAsync } from './../common/catchAsync.js';
import AppError from './../common/appError.js';
import {
    getAllPosts,
    getPostById,
    createNewPost,
    updatePostbyId,
    deletePostbyId,
} from "../services/postService.js";
import createRequest from './../validations/createPostRequest.js';

export const getPosts = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;

    const allPosts = await getAllPosts(communityId);

    res.status(200).json({
        status: 'success',
        results: allPosts.length,
        data: allPosts
    });
});

export const createPost = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;
    const authorId = req.userId;
    const payload = await createRequest.validateAsync(req.body);

    const newPost = await createNewPost(payload, communityId, authorId);

    res.status(201).json({
        status: 'success',
        data: newPost
    });
});

export const getPost = catchAsync(async (req, res, next) => {
    const postId = req.params.postId;

    const post = await getPostById(postId);

    if (!post) {
        return next(new AppError('No post found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: post
    });
});


export const updatePost = catchAsync(async (req, res, next) => {
    const postId = req.params.postId;
    const payload = await createRequest.validateAsync(req.body);

    const updatedPost = await updatePostbyId(payload, postId);

    if (!updatedPost) {
        return next(new AppError('No post found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: updatedPost
    });
});

export const deletePost = catchAsync(async (req, res, next) => {
    const postId = req.params.postId;

    const post = await deletePostbyId(postId);

    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});