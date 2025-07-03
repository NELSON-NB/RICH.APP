// routes/book.routes.js
import express from 'express';
import Book from '../models/book.models.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { io } from '../index.js'; // ✅ Correct import assuming io is exported from index.js

const router = express.Router();

// 📚 Add a new book
router.post('/books', authMiddleware, async (req, res) => {
  try {
    const newBook = await Book.create(req.body);

    console.log('✅ Emitting newBook event:', {
    title: newBook.title,
    author: newBook.author
    });

    // ✅ Emit a socket event to all connected clients
    io.emit('newBook', {
      title: newBook.title,
      author: newBook.author,
      _id: newBook._id,
    });

    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (err) {
    console.error('Add book error:', err);
    res.status(500).json({ message: 'Failed to add book' });
  }
});

export default router;
