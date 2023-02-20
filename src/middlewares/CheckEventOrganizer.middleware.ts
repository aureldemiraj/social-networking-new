import { NextFunction, Response } from 'express';

import { RequestWithData } from '../interfaces/Auth.interface';

import { AuthService } from '../services/Auth.service';
import { EventService } from '../services/Event.service';

import { AppError } from '../utils/AppError.util';
import { catchAsync } from '../utils/CatchAsync.util';

export const checkEventOrganizer = catchAsync(async (req: RequestWithData, res: Response, next: NextFunction) => {
    const { eventId } = req.params;
    const { userId } = req;

    const event = await EventService.getEventById(eventId);

    if (!event) throw new AppError('No event found with that ID', 404);

    await AuthService.checkEventOrganizer(event.eventOrganizer, userId, req.userRole);

    next();
});
