// index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import http from 'http';
import { Server } from 'socket.io';


import User from "./models/user.models.js";
import Book from "./models/book.models.js";
import Comment from './models/comment.models.js';
import authMiddleware from "./middlewares/authMiddleware.js";
import userRoutes from './routes/user.routes.js';
import bookRoutes from './routes/book.routes.js';
import commentRoutes from './routes/comment.routes.js';
import eventRoutes from './routes/event.routes.js';


dotenv.config();

const app = express();
const PORT = 8000;

const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

app.use(userRoutes);
app.use(bookRoutes);
app.use(commentRoutes);
app.use('/events', eventRoutes);

// DB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));
  
  
  const server = http.createServer(app);

  const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your frontend port
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('🟢 A user connected');

  socket.on('disconnect', () => {
    console.log('🔴 A user disconnected');
  });
});





// 🟢 Home test
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Book Club API' });
});

// 🔐 Create account
app.post('/create-account', async (req, res) => {
  const { firstName, lastName, email, phone, password, favoriteGenre, role } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: true, message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: true, message: 'User already exists' });

    const fullName = `${firstName} ${lastName}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      favoriteGenre,
      role:role || "user"
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '20000h',
    });

    res.status(201).json({
      error: false,
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        favoriteGenre: newUser.favoriteGenre,
        role: newUser.role
      },
      token,
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

// 🔓 Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '200000h' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        favoriteGenre: user.favoriteGenre,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 📚 Add Book (full details)
app.post('/books', authMiddleware,  async (req, res) => {
  try {
    const {
      title,
      author,
      genre,
      difficulty,
      rating,
      description,
      publishYear,
      discussionTopics,
      pages,
      link,
      coverColor,
      readingDeadline,
      status,
      isbn
    } = req.body;

    const newBook = new Book({
      title,
      author,
      genre,
      difficulty,
      rating,
      description,
      publishYear,
      discussionTopics,
      pages,
      link,
      coverColor,
      readingDeadline,
      status,
      isbn
    });

    await newBook.save();
    res.status(201).json({ message: 'Book added', book: newBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving book' });
  }
});

// 📖 Get All Books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

// ✏️ Edit Book
app.put('/books/:id', authMiddleware,  async (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedData = req.body;

    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, { new: true });
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });

    res.json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Failed to update book' });
  }
});

// ❌ Delete Book
app.delete('/books/:id', authMiddleware,  async (req, res) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

// 💬 Post Comment
app.post('/comments', authMiddleware, async (req, res) => {
  try {
    const { bookId, text } = req.body;
    const userId = req.user.id;

    const newComment = new Comment({ bookId, userId, text });
    await newComment.save();

    res.status(201).json({ message: 'Comment added', comment: newComment });
  } catch (err) {
    console.error('Comment error:', err.message);
    res.status(500).json({ message: 'Failed to post comment' });
  }
});

// 💬 Get Comments for Book
app.get('/comments/:bookId', async (req, res) => {
  try {
    const comments = await Comment.find({ bookId: req.params.bookId })
      .populate('userId', 'fullName')
      .sort({ postedAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});
app.use('/', userRoutes);

// 🚀 Start server
server.listen(PORT, () => console.log(`🔊 Server running on http://localhost:${PORT}`));
export { io };
