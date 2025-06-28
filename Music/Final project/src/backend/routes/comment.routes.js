import express from 'express';
import { io } from '../index.js'; // ✅ Import io
import Comment from '../models/comment.models.js'; // adjust as needed
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/comments', authMiddleware, async (req, res) => {
  try {
    const { bookId, text } = req.body;
    const userId = req.user.id;

    const newComment = await Comment.create({
      bookId,
      userId,
      text,
      timestamp: new Date(),
    });

    // ✅ Populate user info (optional)
    const populatedComment = await newComment.populate('userId', 'fullName');

    // ✅ Emit event
    io.emit('newComment', {
      bookId,
      comment: {
        id: newComment._id,
        userName: populatedComment.userId.fullName,
        text: newComment.text,
        timestamp: newComment.timestamp
      }
    });

    res.status(201).json(newComment);
  } catch (err) {
    console.error('Comment post failed:', err.message);
    res.status(500).json({ message: 'Failed to post comment' });
  }
});

export default router;
