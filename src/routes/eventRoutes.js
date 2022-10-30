import express from 'express';

import { getEvents, createEvent, getEvent, updateEvent, deleteEvent } from './../controllers/eventController.js';
import { protect, restrictTo, checkEventOrganizer, checkIfJoin } from './../middlewares/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getEvents)
    .post(protect, checkIfJoin, createEvent);

router
    .route('/:eventId')
    .get(getEvent)
    .put(protect, checkEventOrganizer, updateEvent)
    .delete(protect, checkEventOrganizer, deleteEvent);

export default router;