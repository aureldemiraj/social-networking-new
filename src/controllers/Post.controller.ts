import { NextFunction, Request, Response, Router } from 'express';

import { restrictTo } from '../middlewares/Auth.middleware';
import { checkPostAuthor } from '../middlewares/CheckPostAuthor.middleware';
import { validate } from '../middlewares/Validation.middleware';

import { PostService } from '../services/Post.service';

import { catchAsync } from '../utils/CatchAsync.util';

import { CreatePostValidator } from '../validators/index';

export const PostController = Router();

PostController.use(restrictTo('USER', 'ADMIN'));

PostController.get(
    '/:postId',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { postId } = req.params;

        const result = await PostService.getPostById(postId);

        res.status(result.status).send(result.data);
    })
);

PostController.put(
    '/:postId',
    checkPostAuthor,
    validate(CreatePostValidator),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { postId } = req.params;

        const result = await PostService.updatePostbyId(req.body, postId);

        res.status(result.status).send(result.data);
    })
);

PostController.delete(
    '/:postId',
    checkPostAuthor,
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { postId } = req.params;

        const result = await PostService.deletePostbyId(postId);

        res.status(result.status).send(result.data);
    })
);
