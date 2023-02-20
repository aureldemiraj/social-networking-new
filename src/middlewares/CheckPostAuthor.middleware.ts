import { NextFunction, Response } from 'express';

import { RequestWithData } from '../interfaces/Auth.interface';

import { AuthService } from '../services/Auth.service';
import { PostService } from '../services/Post.service';

import { AppError } from '../utils/AppError.util';
import { catchAsync } from '../utils/CatchAsync.util';

export const checkPostAuthor = catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { userId } = req;

    const post = await PostService.getPost(postId);

    if (!post) throw new AppError('No post found with that ID', 404);

    await AuthService.checkPostAuthor(post.authorId, userId, req.userRole);

    next();
});
