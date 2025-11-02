import Book from '../models/Book.js';
import User from '../models/User.js';

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

// Create a new book (admin only)
const createBook = async (req, res) => {
  try {
    const { name, author, price, totalCopies = 1 } = req.body;
    
    const book = new Book({
      name,
      author,
      price,
      totalCopies,
      availableCopies: totalCopies
    });
    
    await book.save();
    res.status(201).json({ message: 'Book created successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

// Update a book (admin only)
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, author, price, totalCopies } = req.body;
    
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Update book details
    book.name = name || book.name;
    book.author = author || book.author;
    book.price = price || book.price;
    
    if (totalCopies !== undefined) {
      const borrowedCount = book.totalCopies - book.availableCopies;
      book.totalCopies = totalCopies;
      book.availableCopies = Math.max(0, totalCopies - borrowedCount);
    }
    
    await book.save();
    res.json({ message: 'Book updated successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

// Delete a book (admin only)
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if book is currently borrowed
    if (book.availableCopies < book.totalCopies) {
      return res.status(400).json({ message: 'Cannot delete book that is currently borrowed' });
    }
    
    await Book.findByIdAndDelete(id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};

// Borrow a book
const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user.id; // Get user ID from authenticated user

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if book is available
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies of this book are available' });
    }

    // Check if user has reached their borrowing limit
    if (user.borrowedBooks.length >= user.borrowingLimit) {
      return res.status(400).json({ 
        message: `User cannot borrow more than ${user.borrowingLimit} books` 
      });
    }

    // Check if user has already borrowed this book
    if (user.borrowedBooks.includes(bookId)) {
      return res.status(400).json({ message: 'User has already borrowed this book' });
    }

    // Update book
    book.availableCopies -= 1;
    book.borrowedCopies.push({
      user: userId,
      borrowedDate: new Date()
    });
    await book.save();

    // Update user
    user.borrowedBooks.push(bookId);
    await user.save();

    res.json({ message: 'Book borrowed successfully', book });
  } catch (error) {
    console.error('Error borrowing book:', error);
    res.status(500).json({ message: 'Error borrowing book', error: error.message });
  }
};

// Return a book
const returnBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user.id; // Get user ID from authenticated user

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user has borrowed this book
    const borrowedCopy = book.borrowedCopies.find(copy => 
      copy.user.toString() === userId
    );
    
    if (!borrowedCopy) {
      return res.status(400).json({ message: 'User has not borrowed this book' });
    }

    // Update book
    book.availableCopies += 1;
    book.borrowedCopies = book.borrowedCopies.filter(copy => 
      copy.user.toString() !== userId
    );
    await book.save();

    // Update user
    user.borrowedBooks = user.borrowedBooks.filter(id => id.toString() !== bookId);
    await user.save();

    res.json({ message: 'Book returned successfully', book });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Error returning book', error: error.message });
  }
};

// Get borrowed books for a user
const getUserBorrowedBooks = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user.id; // Get user ID from authenticated user

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get borrowed books with populated details
    const borrowedBooks = await Book.find({ 
      'borrowedCopies.user': userId 
    });
    
    res.json(borrowedBooks);
  } catch (error) {
    console.error('Error fetching borrowed books:', error);
    res.status(500).json({ message: 'Error fetching borrowed books', error: error.message });
  }
};

// Get books with availability status for display
const getBooksWithAvailability = async (req, res) => {
  try {
    const books = await Book.find();
    
    // Add availability status to each book
    const booksWithAvailability = books.map(book => ({
      ...book.toObject(),
      isAvailable: book.availableCopies > 0,
      availabilityText: book.availableCopies > 0 
        ? `${book.availableCopies} of ${book.totalCopies} available` 
        : 'Not available'
    }));
    
    res.json(booksWithAvailability);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

export { 
  getAllBooks, 
  createBook, 
  updateBook, 
  deleteBook,
  borrowBook, 
  returnBook, 
  getUserBorrowedBooks,
  getBooksWithAvailability
};