import express from 'express';
import { restrictTo } from './../middlewares/authMiddleware.js';
import { checkIfJoined } from './../middlewares/checkIfJoined.js';
import { checkPostAuthor } from './../middlewares/checkPostAuthor.js';
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