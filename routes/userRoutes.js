import express from 'express';

import { getUsers } from './../controllers/userController.js';
import { register, login, protect, restrict, adminOnly } from './../controllers/authController.js'

const router = express.Router();

router.post('/register', register);
router.post('/login', login)

// Protect all routes after this middleware
router.use(protect, adminOnly);

router
    .route('/')
    .get(getUsers);

export default router;