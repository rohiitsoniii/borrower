import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/borrowing-insights', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.log('MongoDB connection error:', err));

// Sample data
const sampleBooks = [
  {
    name: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    price: 12.99,
    totalCopies: 3,
    availableCopies: 3
  },
  {
    name: '1984',
    author: 'George Orwell',
    price: 10.99,
    totalCopies: 2,
    availableCopies: 2
  },
  {
    name: 'Pride and Prejudice',
    author: 'Jane Austen',
    price: 9.99,
    totalCopies: 4,
    availableCopies: 4
  },
  {
    name: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 11.99,
    totalCopies: 1,
    availableCopies: 1
  },
  {
    name: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    price: 14.99,
    totalCopies: 5,
    availableCopies: 5
  },
  {
    name: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    price: 13.99,
    totalCopies: 2,
    availableCopies: 2
  }
];

const sampleUsers = [
  { 
    name: 'Admin User', 
    email: 'admin@example.com',
    password: 'admin123',
    borrowingLimit: 10
  },
  { 
    name: 'Alice Johnson', 
    email: 'alice@example.com',
    password: 'password123',
    borrowingLimit: 2
  },
  { 
    name: 'Bob Smith', 
    email: 'bob@example.com',
    password: 'password123',
    borrowingLimit: 3
  },
  { 
    name: 'Charlie Brown', 
    email: 'charlie@example.com',
    password: 'password123',
    borrowingLimit: 2
  },
  { 
    name: 'Diana Prince', 
    email: 'diana@example.com',
    password: 'password123',
    borrowingLimit: 4
  },
  { 
    name: 'Edward Norton', 
    email: 'edward@example.com',
    password: 'password123',
    borrowingLimit: 2
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});
    
    // Hash passwords
    const usersWithHashedPasswords = await Promise.all(sampleUsers.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return {
        ...user,
        password: hashedPassword
      };
    }));
    
    // Insert sample books
    await Book.insertMany(sampleBooks);
    console.log('Books seeded successfully');
    
    // Insert sample users
    await User.insertMany(usersWithHashedPasswords);
    console.log('Users seeded successfully');
    
    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();