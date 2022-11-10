import AppError from './../common/appError.js';
import { catchAsync } from './../common/catchAsync.js';
import { getEventById } from './../services/eventService.js';

export const checkEventOrganizer = catchAsync(async (req, res, next) => {
    const eventId = req.params.eventId;
    const userId = req.userId;

    const event = await getEventById(eventId);

    if (!event) {
        return next(new AppError('No event found with that ID', 404))
    }

    if (!(event.eventOrganizer === userId || req.userRole === 'ADMIN')) {
        return next(new AppError('You can only edit or delete your events', 403))
    }

    next();
});