import { PostService } from '../services/Post.service.js';

import { AppError } from '../utils/AppError.util.js';
import { catchAsync } from '../utils/CatchAsync.util.js';

export const checkPostAuthor = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const { userId } = req;

    const post = await PostService.getPost(postId);

    if (!post) throw new AppError('No post found with that ID', 404);

    if (!(post.authorId == userId || req.userRole == 'ADMIN'))
        throw new AppError('You can only edit or delete your posts', 403);

    next();
});
