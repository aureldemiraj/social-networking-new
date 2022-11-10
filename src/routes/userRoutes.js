import express from 'express';

import {
    restrictTo
} from './../middlewares/authMiddleware.js';
import {
    getUsers,
    register,
    login,
    getMe,
    getUser,
    forgotPassword,
    resetPassword,
    logout,
    deleteMe
} from './../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(restrictTo('USER', 'ADMIN'));

router.post('/logout', logout);
router.get('/me', getMe, getUser);
router.delete('/deleteMe', deleteMe);
router.get('/:userId', getUser);

router.use(restrictTo('ADMIN'));

router
    .route('/')
    .get(getUsers);

export default router;