import express from 'express';
import passport from 'passport';
import * as commentController from '../controllers/commentController.js';

const router = express.Router();

// Authenticate user before proceeding
router.use('*', passport.authenticate('jwt', { session: false }));

// GET fetch list of comments
router.get('/:id', commentController.commentsList_get);

// POST create comment
router.post('/create/:id', commentController.createComment_post);

// DELETE delete comment
router.delete('/delete/:id', commentController.deleteComment_delete);

// PUT update like status of comment
router.put('/like/:id', commentController.changeLikeStatus_put);

export default router;
