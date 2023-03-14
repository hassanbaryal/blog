import express from 'express';
import passport from 'passport';
import * as postController from '../controllers/postController.js';

const router = express.Router();

router.all('*', passport.authenticate('jwt', { session: false }));

// GET all posts
router.get('/', postController.allPosts_get);

// GET specific post
router.get('/:id', postController.post_get);

// POST create a post
router.post('/create', postController.createPost_post);

// DELETE delete comment
router.delete('/delete/:id', postController.deletePost_delete);

// PUT update like status
router.put('/like/:id', postController.changeLikeStatus_put);

export default router;
