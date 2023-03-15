import { body, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

// Create admin user up on POST
const createAdminUser_post = [
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
  body('code')
    .trim()
    .isLength({ min: 1 })
    .equals(process.env.ADMIN_CODE || 'qwertyasdfcxz')
    .escape()
    .withMessage('Admin code is incorrect'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({
        errors: errors.array(),
      });

    return User.find({ username: req.body.username }).exec((err, user) => {
      if (err)
        return res.status(500).json({
          message: 'Something went wrong...',
        });
      if (user)
        return res.status(400).json({
          errors: [{ msg: 'Username already exists' }],
        });
      return bcrypt.hash(req.body.password, 10, (error, hashedPassword) => {
        if (error)
          return res.status(500).json({
            message: 'Something went wrong...',
          });
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          admin: true,
        });
        return user.save((err: unknown) => {
          if (err)
            return res.status(500).json({
              message: 'Something went wrong...',
            });

          return res.status(201).json({
            message: 'Admin successfully created!',
          });
        });
      });
    });
  },
];

// Log admin in on POST
const adminLogin_post = [
  body('username')
    .trim()
    .isLength({ min: 1, max: 20 })
    .isAlphanumeric()
    .escape()
    .withMessage(
      'Username is required (max 20 characters, letters and numbers only)'
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
      (err: Error, user: IUser, info: unknown) => {
        // If error or no user found
        if (err || !user) {
          return res.status(400).json(info);
        }

        if (!user.admin)
          return res.status(400).json([
            {
              msg: 'You are not an admin!',
            },
          ]);

        req.login(user, { session: false }, (error: Error) => {
          if (error)
            return res.status(500).json({
              message: 'Something went wrong...',
            });
          const jwtSecret = process.env.JWT_SECRET || 'jwtsecret';

          const token = jwt.sign({ user }, jwtSecret, {
            expiresIn: '1d',
          });
          return res.status(200).json({ user, token: `Bearer ` + token });
        });
      }
    )(req, res);
  },
];

export { createAdminUser_post, adminLogin_post };
