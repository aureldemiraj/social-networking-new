import express from 'express';

import { getCommunities, createCommunity, getCommunity, joinCommunity, leaveCommunity } from './../controllers/communityController.js';
import { protect } from './../controllers/authController.js';

import eventRouter from './eventRoutes.js';
import postRouter from './postRoutes.js';

const router = express.Router();

router.use('/:communityId/events', eventRouter);
router.use('/:communityId/posts', postRouter);

router
    .route('/')
    .get(getCommunities)
    .post(createCommunity);

router
    .route('/:communityId')
    .get(getCommunity);

router.use(protect);

router.post('/:communityId/join', joinCommunity);
router.post('/:communityId/leave', leaveCommunity);

export default router;