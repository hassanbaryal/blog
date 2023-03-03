import express from 'express';
import * as userController from '../controllers/userController.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    text: 'Hello',
    banana: 'there',
  });
});

router.post('/signup', userController.signup_post);

export default router;
