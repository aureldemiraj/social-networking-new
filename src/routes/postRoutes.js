import express from 'express';

import {
    checkPostAuthor,
    checkIfJoined,
    restrictTo
} from './../middlewares/authMiddleware.js';
import {
    getPosts,
    createPost,
    getPost,
    updatePost,
    deletePost
} from './../controllers/postController.js';

const router = express.Router({ mergeParams: true });

router.use(restrictTo('USER', 'ADMIN'));

router.get('/', checkIfJoined, getPosts);

router.post('/', checkIfJoined, createPost);

router
    .route('/:postId')
    .get(getPost)
    .put(checkPostAuthor, updatePost)
    .delete(checkPostAuthor, deletePost);

export default router;