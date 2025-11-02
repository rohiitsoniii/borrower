import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Update user borrowing limit (admin only)
const updateUserBorrowingLimit = async (req, res) => {
  try {
    const { id } = req.params;
    const { borrowingLimit } = req.body;
    
    // Validate borrowing limit
    if (borrowingLimit < 1 || borrowingLimit > 10) {
      return res.status(400).json({ message: 'Borrowing limit must be between 1 and 10' });
    }
    
    const user = await User.findByIdAndUpdate(
      id, 
      { borrowingLimit },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User borrowing limit updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has borrowed books
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.borrowedBooks.length > 0) {
      return res.status(400).json({ message: 'Cannot delete user with borrowed books' });
    }
    
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      borrowingLimit: user.borrowingLimit,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      borrowingLimit: user.borrowingLimit,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Get user borrowing info
const getUserBorrowingInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user with populated borrowed books
    const user = await User.findById(userId).populate('borrowedBooks');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      borrowedBooks: user.borrowedBooks,
      borrowingLimit: user.borrowingLimit,
      booksBorrowed: user.borrowedBooks.length,
      booksRemaining: user.borrowingLimit - user.borrowedBooks.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user borrowing info', error: error.message });
  }
};

export { 
  getAllUsers, 
  getUserById,
  updateUserBorrowingLimit,
  deleteUser,
  loginUser, 
  registerUser, 
  getUserBorrowingInfo 
};