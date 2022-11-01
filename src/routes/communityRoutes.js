import express from 'express';

import eventRouter from './eventRoutes.js';
import postRouter from './postRoutes.js';
import {
    protect,
    restrictTo
} from './../middlewares/authMiddleware.js';
import {
    getCommunities,
    createCommunity,
    getCommunity,
    joinCommunity,
    leaveCommunity,
    largestCommunites,
    mostActiveCommunities,
    myCommunities
} from './../controllers/communityController.js';

const router = express.Router();

router.get('/', getCommunities);
router.get('/largestCommunities', largestCommunites);
router.get('/mostActiveCommunities', mostActiveCommunities);

router.use(protect);

router.post('/', restrictTo('ADMIN'), createCommunity);

router.get('/myCommunities', myCommunities);

router
    .route('/:communityId')
    .get(getCommunity);

router.use('/:communityId/events', eventRouter);
router.use('/:communityId/posts', postRouter);


router.post('/:communityId/join', joinCommunity);
router.post('/:communityId/leave', leaveCommunity);

export default router;