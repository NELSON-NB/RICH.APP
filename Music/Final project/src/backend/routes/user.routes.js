import express from 'express';
import User from '../models/user.models.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Get current authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// ✅ Update profile info
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const allowedUpdates = ['fullName', 'email', 'phone', 'favoriteGenre'];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// ✅ Fake logout endpoint for JWT (stateless)
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
