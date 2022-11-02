import express from 'express';

import {
    checkEventOrganizer,
    checkIfJoin,
    protect
} from './../middlewares/authMiddleware.js';
import {
    getEvents,
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    confirmGoing,
    cancelConfirmation,
    getEventParticipants,
    myEvents,
    subscribedEvents
} from './../controllers/eventController.js';

const router = express.Router({ mergeParams: true });

router.get('/', getEvents);

router.get('/myEvents', protect, myEvents);
router.get('/subscribedEvents', protect, subscribedEvents);

router.use(checkIfJoin);

router.post('/', createEvent);

router
    .route('/:eventId')
    .get(getEvent)
    .put(checkEventOrganizer, updateEvent)
    .delete(checkEventOrganizer, deleteEvent);

router.post('/:eventId/going', confirmGoing);
router.post('/:eventId/cancel', cancelConfirmation);

router.get('/:eventId/participants', getEventParticipants);

export default router;