import { AppError } from '../utils/AppError.util.js';
import { catchAsync } from '../utils/CatchAsync.util.js';
import { EventService } from '../services/Event.service.js';

export const checkEventOrganizer = catchAsync(async (req, res, next) => {
    const { eventId } = req.params;
    const { userId } = req;

    const event = await EventService.getEventById(eventId);

    if (!event) return next(new AppError('No event found with that ID', 404));

    if (!(event.eventOrganizer === userId || req.userRole === 'ADMIN'))
        return next(new AppError('You can only edit or delete your events', 403));

    next();
});
