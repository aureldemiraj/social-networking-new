import { CommunityService } from '../services/Community.service.js';

import { AppError } from '../utils/AppError.util.js';
import { catchAsync } from '../utils/CatchAsync.util.js';

export const checkIfJoined = catchAsync(async (req, res, next) => {
    const { communityId } = req.params;
    const { userId } = req;

    if (!communityId) throw new AppError('Please provide a community!', 400);

    const userInCommunity = await CommunityService.isUserJoined(userId, communityId);

    if (!userInCommunity) throw new AppError('You should join the community to perform this action', 403);

    next();
});
