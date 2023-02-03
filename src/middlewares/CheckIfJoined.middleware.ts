import { NextFunction, Response } from 'express';

import { RequestWithData } from '../interfaces/Auth.interface';

import { CommunityService } from '../services/Community.service';

import { AppError } from '../utils/AppError.util';
import { catchAsync } from '../utils/CatchAsync.util';

export const checkIfJoined = catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
    const { communityId } = req.params;
    const { userId } = req;

    if (!communityId) throw new AppError('Please provide a community!', 400);

    const userInCommunity = await CommunityService.isUserJoined(userId, communityId);

    if (!userInCommunity) throw new AppError('You should join the community to perform this action', 403);

    next();
});
