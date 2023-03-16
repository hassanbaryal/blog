import express from 'express';
import passport from 'passport';
import * as postController from '../controllers/postController.js';
import verifyAdmin from '../middlewares/verifyAdmin.mw.js';

const router = express.Router();

router.all('*', passport.authenticate('jwt', { session: false }));

// GET all posts
router.get('/', verifyAdmin, postController.allPosts_get);

// GET all published posts
router.get('/published', postController.allPublishedPosts_get);

// GET specific post
router.get('/:id', postController.post_get);

// POST create a post
router.post('/create', verifyAdmin, postController.createPost_post);

// DELETE delete post
router.delete('/delete/:id', verifyAdmin, postController.deletePost_delete);

// PUT update like status
router.put('/like/:id', postController.changeLikeStatus_put);

// PUT update published status
router.put(
  '/publish/:id',
  verifyAdmin,
  postController.updatePublishedStatus_put
);

export default router;
