import User from '../models/User.js';
import Book from '../models/Book.js';

// Get top 3 users with highest number of borrowed books
const getTopUsers = async (req, res) => {
  try {
    // Aggregate to count borrowed books per user
    const userBorrowCounts = await Book.aggregate([
      { $unwind: '$borrowedCopies' },
      { $group: { _id: '$borrowedCopies.user', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);
    
    // Populate user details
    const topUsers = [];
    for (const borrowCount of userBorrowCounts) {
      const user = await User.findById(borrowCount._id);
      if (user) {
        topUsers.push({
          _id: user._id,
          name: user.name,
          email: user.email,
          borrowedBooksCount: borrowCount.count
        });
      }
    }

    res.json(topUsers);
  } catch (error) {
    console.error('Error in getTopUsers:', error);
    res.status(500).json({ message: 'Error fetching top users', error: error.message });
  }
};

// Generate daily borrow counts for the past 7 days
const getDailyBorrows = async (req, res) => {
  try {
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Aggregate to count borrows per day
    const dailyBorrows = await Book.aggregate([
      { $unwind: '$borrowedCopies' },
      { $match: { 'borrowedCopies.borrowedDate': { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$borrowedCopies.borrowedDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Initialize array for last 7 days
    const dailyCounts = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateString = date.toISOString().split('T')[0];
      const borrowData = dailyBorrows.find(d => d._id === dateString);
      
      dailyCounts.push({
        date: dateString,
        count: borrowData ? borrowData.count : 0
      });
    }

    res.json(dailyCounts);
  } catch (error) {
    console.error('Error in getDailyBorrows:', error);
    res.status(500).json({ message: 'Error fetching daily borrow counts', error: error.message });
  }
};

export { getTopUsers, getDailyBorrows };