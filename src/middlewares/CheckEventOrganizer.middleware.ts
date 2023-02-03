import { NextFunction, Response } from 'express';

import { RequestWithData } from '../interfaces/Auth.interface';

import { EventService } from '../services/Event.service';

import { AppError } from '../utils/AppError.util';
import { catchAsync } from '../utils/CatchAsync.util';

export const checkEventOrganizer = catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
    const { eventId } = req.params;
    const { userId } = req;

    const event = await EventService.getEventById(eventId);

    if (!event) throw new AppError('No event found with that ID', 404);

    if (!(event.eventOrganizer == userId || req.userRole == 'ADMIN'))
        throw new AppError('You can only edit or delete your events', 403);

    next();
});
