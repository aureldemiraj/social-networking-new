import express from 'express';
import { restrictTo } from './../middlewares/authMiddleware.js';
import { checkIfJoined } from './../middlewares/checkIfJoined.js';
import { checkEventOrganizer } from './../middlewares/checkEventOrganizer.js';
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

router.use(restrictTo('USER', 'ADMIN'));

router.get('/', getEvents);
router.get('/myEvents', myEvents);
router.get('/subscribedEvents', subscribedEvents);
router.post('/', checkIfJoined, createEvent);
router
    .route('/:eventId')
    .get(getEvent)
    .put(checkEventOrganizer, updateEvent)
    .delete(checkEventOrganizer, deleteEvent);
router.get('/:eventId/subscribers', getEventSubscribers);
router.post('/:eventId/subscribe', subscribe);
router.post('/:eventId/unsubscribe', unsubscribe);

export default router;