import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Comment from '../models/comment.js';

// Fetch comments list from post id on GET
const commentsList_get = (req: Request, res: Response) => {
  Comment.find({ post: req.params.id })
    .populate('user')
    .exec((err, comments) => {
      if (err)
        return res.status(500).json({
          message: 'Something went wrong...',
        });

      return res.status(200).json({
        comments,
      });
    });
};

// Create comment on POST
const createComment_post = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment text is required (max 1000 characters'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors });

    const { user }: any = req.user;

    const comment = new Comment({
      text: req.body.text,
      user: user._id,
      post: req.params.id,
      likes: [],
    });

    return comment.save((err) => {
      if (err)
        return res.status(500).json({
          message: 'Something went wrong while saving comment...',
        });

      return res.status(201).json({
        message: 'Comment created successfully!',
      });
    });
  },
];

// Delete comment on DELETE
const deleteComment_delete = (req: Request, res: Response) => {
  Comment.deleteOne({ _id: req.params.id }).exec((err) => {
    if (err)
      return res.status(500).json({
        message: 'Something went wrong...',
      });

    return res.status(204).json({
      message: 'Comment deleted Successfully!',
    });
  });
};

// Like comment on PUT
const changeLikeStatus_put = (req: Request, res: Response) => {
  Comment.findOne({ _id: req.params.id }).exec((err, comment) => {
    if (err)
      res.status(500).json({
        message: 'Something went wrong...',
      });

    const { user }: any = req.user;

    if (!comment?.likes.includes(user._id)) {
      comment?.likes.push(user._id);
    } else {
      const index = comment.likes.findIndex((id) => id === user._id);
      comment.likes.splice(index, 1);
    }

    return comment?.save((err) => {
      if (err)
        res.status(500).json({
          message: 'Something went wrong...',
        });

      res.status(201).json({
        message: 'Comment updated successfully!',
      });
    });
  });
};
export {
  commentsList_get,
  createComment_post,
  deleteComment_delete,
  changeLikeStatus_put,
};
