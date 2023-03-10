import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import async from 'async';
import Post from '../models/post.js';
import Comment from '../models/comment.js';

// Get list of all post on GET
const allPosts_get = (req: Request, res: Response) => {
  return async.parallel(
    {
      posts(cb) {
        Post.find().populate('user').exec(cb);
      },
      comments(cb) {
        Comment.find().exec(cb);
      },
    },
    (err, results) => {
      if (err)
        return res.status(500).json({
          message: 'Something went wrong...',
        });

      return res.status(200).json({
        posts: results.posts,
        comments: results.comments,
      });
    }
  );
};

// Get post by id on GET
const post_get = (req: Request, res: Response) => {
  return async.parallel(
    {
      post(cb) {
        Post.findById(req.params.id).populate('user').exec(cb);
      },
      comments(cb) {
        Comment.find({ post: req.params.id }).populate('user').exec(cb);
      },
    },
    (err, results) => {
      if (err)
        return res.status(500).json({
          message: 'Something went wrong...',
        });

      return res.status(200).json({
        post: results.post,
        comments: results.comments,
      });
    }
  );
};

// Create post on POST
const createPost_post = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage('Title required (max 80 characters)'),
  body('body')
    .trim()
    .isLength({ min: 1, max: 3000 })
    .withMessage('Post body required (max 3000 characters)'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { user }: any = req.user;

    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      user: user._id,
      published: req.body.published === 'true' ? true : false,
      likes: [],
    });

    return post.save((err) => {
      if (err)
        return res.status(500).json({
          message: 'Something went wrong while saving post...',
        });

      return res.status(201).json({
        message: 'Post created successfully!',
      });
    });
  },
];

export { allPosts_get, post_get, createPost_post };
