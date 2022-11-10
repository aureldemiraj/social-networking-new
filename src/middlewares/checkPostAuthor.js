import AppError from './../common/appError.js';
import { catchAsync } from './../common/catchAsync.js';
import { getPostById } from './../services/postService.js';

export const checkPostAuthor = catchAsync(async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.userId;

    const post = await getPostById(postId);

    if (!post) {
        return next(new AppError('No post found with that ID', 404))
    }

    if (!(post.authorId === userId || req.userRole === 'ADMIN')) {
        return next(new AppError('You can only edit or delete your posts', 403))
    }

    next();
})