import express from 'express';
import * as userController from '../controllers/userController.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    text: 'Hello',
    banana: 'there',
  });
});

// POST create new user on signup
router.post('/signup', userController.signup_post);

// POST log user in
router.post('/login', userController.login_post);

export default router;
