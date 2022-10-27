import express from 'express';

import { getEvents, createEvent, getEvent, updateEvent, deleteEvent } from './../controllers/eventController.js';
import { protect, restrict, checkEventOrganizer } from './../controllers/authController.js';

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getEvents)
    .post(protect, restrict, createEvent);

router
    .route('/:eventId')
    .get(getEvent)
    .put(protect, checkEventOrganizer, updateEvent)
    .delete(protect, checkEventOrganizer, deleteEvent);

export default router;