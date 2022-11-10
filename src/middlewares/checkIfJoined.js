import AppError from './../common/appError.js';
import { catchAsync } from './../common/catchAsync.js';
import { isUserJoined } from './../services/communityService.js';

export const checkIfJoined = catchAsync(async (req, res, next) => {
    const communityId = req.params.communityId;
    const userId = req.userId;

    if (!communityId) {
        return next(new AppError('Please provide a community!', 400))
    }

    const userInCommunity = await isUserJoined(userId, communityId);

    if (!userInCommunity) {
        return next(new AppError('You should join the community to perform this action', 403))
    }

    next();
});