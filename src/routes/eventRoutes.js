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
    subscribe,
    unsubscribe,
    getEventSubscribers,
    myEvents,
    subscribedEvents
} from './../controllers/eventController.js';

const router = express.Router({ mergeParams: true });

router.get('/', getEvents);

router.get('/myEvents', protect, myEvents);
router.get('/subscribedEvents', protect, subscribedEvents);

router.post('/', checkIfJoin, createEvent);

router
    .route('/:eventId')
    .get(getEvent)
    .put(checkEventOrganizer, updateEvent)
    .delete(checkEventOrganizer, deleteEvent);

router.get('/:eventId/subscribers', getEventSubscribers);
router.post('/:eventId/subscribe', subscribe);
router.post('/:eventId/unsubscribe', unsubscribe);


export default router;