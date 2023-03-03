import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Create user on POST
const signup_post = [
  body('username')
    .trim()
    .isLength({ min: 1, max: 20 })
    .isAlphanumeric()
    .escape()
    .withMessage(
      'Username is required (max 20 characters, letters and numbers only'
    ),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Password is required'),
  (req: any, res: any) => {
    const errors = validationResult(req);
    // console.log(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    return bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err)
        return res.status(500).json({
          message: 'Something went wrong',
        });

      const user = new User({
        username: 'test',
        password: hashedPassword,
      });

      return user.save((err) => {
        if (err)
          return res.status(500).json({
            msg: 'Something went wrong',
          });

        return res.status(201).json({
          message: 'User create',
        });
      });
    });
  },
];

export { signup_post };
