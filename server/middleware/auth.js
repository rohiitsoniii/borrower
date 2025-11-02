import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
const admin = async (req, res, next) => {
  // For simplicity, we'll make the first user an admin
  // In a real application, you might want a separate isAdmin field
  try {
    const userCount = await User.countDocuments();
    if (userCount === 1 || req.user.email === 'admin@example.com') {
      // First user or user with admin email is admin
      next();
    } else {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error checking admin status', error: error.message });
  }
};

export { protect, admin };