import User from '../models/user.models.js';

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const user = await User.findById(userId);

    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied: Admins only' });

    next();
  } catch (err) {
    console.error('Admin middleware error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export default adminMiddleware;
