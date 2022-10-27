import express from 'express';

import { getPosts, createPost, getPost, updatePost, deletePost } from './../controllers/postController.js';
import { protect, restrict, checkPostAuthor } from './../controllers/authController.js';

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getPosts)
    .post(protect, restrict, createPost);

router
    .route('/:postId')
    .get(getPost)
    .put(protect, checkPostAuthor, updatePost)
    .delete(protect, checkPostAuthor, deletePost);


export default router;