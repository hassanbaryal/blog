import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { Request, Response } from 'express';

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
  (req: Request, res: Response) => {
    const errors = validationResult(req);
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
        username: req.body.username,
        password: hashedPassword,
      });

      return user.save((err: unknown) => {
        if (err)
          return res.status(500).json({
            message: 'Something went wrong',
          });

        return res.status(201).json({
          message: 'User create',
        });
      });
    });
  },
];

// Login user on POST
const login_post = [
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
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    passport.authenticate(
      'local',
      { session: false },
      (err: Error, user: any, info: unknown) => {
        // If error or no user found
        if (err || !user) {
          return res.status(400).json(info);
        }

        req.login(user, { session: false }, (error: Error) => {
          if (error)
            return res.status(500).json({
              message: 'Something went wrong',
            });
          
          const jwtSecret = process.env.JWT_SECRET || 'jwtsecret';

          const token = jwt.sign(
            user.toJSON(),
            jwtSecret,
            {
              expiresIn: '1d'
            }
          );
          return res.status(200).json({ user, token: `Bearer ` + token });
        });
      }
    )(req, res);
  },
];


export { signup_post, login_post };
