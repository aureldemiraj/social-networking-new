import { Router } from 'express';

import { restrictTo } from '../middlewares/Auth.middleware.js';
import { checkPostAuthor } from '../middlewares/CheckPostAuthor.middleware.js';

import { PostService } from '../services/Post.service.js';

import { catchAsync } from '../utils/CatchAsync.util.js';

import { CreatePostValidator } from '../validators/index.js';

export const PostController = Router();

PostController.use(restrictTo('USER', 'ADMIN'));

PostController.get(
    '/:postId',
    catchAsync(async (req, res, next) => {
        const { postId } = req.params;

        const result = await PostService.getPostById(postId);

        res.status(result.status).send(result.data);
    })
);

PostController.put(
    '/:postId',
    checkPostAuthor,
    catchAsync(async (req, res, next) => {
        const { postId } = req.params;
        const payload = await CreatePostValidator.validateAsync(req.body);

        const result = await PostService.updatePostbyId(payload, postId);

        res.status(result.status).send(result.data);
    })
);

PostController.delete(
    '/:postId',
    checkPostAuthor,
    catchAsync(async (req, res, next) => {
        const { postId } = req.params;

        const result = await PostService.deletePostbyId(postId);

        res.status(result.status).send(result.data);
    })
);
