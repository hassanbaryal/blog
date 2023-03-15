import express from 'express';
import * as userController from '../controllers/userController.js';
import * as adminController from '../controllers/adminController.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    text: 'Hello',
    banana: 'there',
  });
});

// POST create new user on signup
router.post('/signup', userController.signup_post);

// POST create new admin on signup
router.post('/admin/signup', adminController.createAdminUser_post);

// POST log user in
router.post('/login', userController.login_post);

// POST log admin in
router.post('/admin/login', adminController.adminLogin_post);

export default router;
