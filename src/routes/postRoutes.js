import express from 'express';

import {
    checkPostAuthor,
    checkIfJoin
} from './../middlewares/authMiddleware.js';
import {
    getPosts,
    createPost,
    getPost,
    updatePost,
    deletePost
} from './../controllers/postController.js';

const router = express.Router({ mergeParams: true });

router.get('/', getPosts);

router.use(checkIfJoin);

router.post('/', createPost);

router
    .route('/:postId')
    .get(getPost)
    .put(checkPostAuthor, updatePost)
    .delete(checkPostAuthor, deletePost);

export default router;