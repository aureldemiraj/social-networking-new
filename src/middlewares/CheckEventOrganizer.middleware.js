import { EventService } from '../services/Event.service.js';

import { AppError } from '../utils/AppError.util.js';
import { catchAsync } from '../utils/CatchAsync.util.js';

export const checkEventOrganizer = catchAsync(async (req, res, next) => {
    const { eventId } = req.params;
    const { userId } = req;

    const event = await EventService.getEventById(eventId);

    if (!event) throw new AppError('No event found with that ID', 404);

    if (!(event.eventOrganizer == userId || req.userRole == 'ADMIN'))
        throw new AppError('You can only edit or delete your events', 403);

    next();
});
