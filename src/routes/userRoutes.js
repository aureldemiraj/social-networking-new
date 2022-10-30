import express from 'express';

import { getUsers, register, login, getMe, getUser } from './../controllers/userController.js';
import { protect, restrictTo } from './../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/forgotPassword'); //toDo
router.put('resetPassword/:token'); //toDo

// Protect all routes after this middleware
router.use(protect);

router.get('/me', getMe, getUser);
router.put('/updateMe'); //toDo
router.delete('deleteMe'); //toDo

router.get('/:userId', getUser);

router.use(restrictTo('ADMIN'));

router
    .route('/')
    .get(getUsers);

export default router;