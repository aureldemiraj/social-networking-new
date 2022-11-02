import express from 'express';

import {
    protect,
    restrictTo
} from './../middlewares/authMiddleware.js';
import {
    getUsers,
    register,
    login,
    getMe,
    getUser,
    forgotPassword,
    resetPassword
} from './../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword); //toDo
router.put('/resetPassword/:token', resetPassword); //toDo

router.use(protect);

router.get('/me', getMe, getUser);
router.put('/updateMe'); //toDo
router.delete('/deleteMe'); //toDo
router.get('/:userId', getUser);

router.use(restrictTo('ADMIN'));

router
    .route('/')
    .get(getUsers);

export default router;