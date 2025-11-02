# MERN Stack Borrowing Insights Application

## Requirements

### Borrowing Logic
- Implement functionality for users to borrow books
- A user cannot borrow more than 2 books (configurable 1-10)
- If the limit is exceeded, the system should reject the action with a clear error
- Consider book name, author name, price for books data
- Support multiple copies of the same book

### Analytics
- Provide an endpoint that returns insights about borrowing, including:
  - Identify the top 3 users with the highest number of borrowed books
  - Implement a book return management system to update and track book availability
  - Generate daily borrow counts for the past 7 days

### Frontend
1. Book Listing Page
   - Display books in a simple table or grid (Book Name, Author, Price, Availability)
   - Show a "Borrow" button next to each available book
   - Disable the borrow button for books that are already borrowed
   - Include search and filter functionality

2. User Selection
   - Dropdown to select the user who is borrowing or returning books
   - Display dropdown at the top of the page
   - Show a small note: "A user can borrow up to 2 books" (configurable)

3. Borrowed Books List
   - Panel showing all books currently borrowed by the selected user
   - Each borrowed book has a "Return" button
   - Clicking "Return" calls the return API and refreshes the lists

4. Admin Panel
   - Dedicated admin dashboard for managing books and users
   - Ability to add/remove books
   - Configurable borrowing limits per user (1-10 books)
   - User management capabilities

## Implementation Prompts Used

1. Initial Setup:
   ```
   Create a MERN stack application with client (React/Vite/TailwindCSS) and server (Node.js/Express/MongoDB) folders
   ```

2. Backend Structure:
   ```
   Set up Express server with MongoDB connection, models for books and users, and controllers for borrowing logic
   ```

3. Frontend Structure:
   ```
   Create React app with Vite and TailwindCSS, with components for book listing, user selection, and borrowed books
   ```

4. Borrowing Logic Implementation:
   ```
   Implement borrowing functionality with 2-book limit per user, including validation and error handling
   ```

5. Analytics Endpoints:
   ```
   Create API endpoints for top 3 users, book return management, and daily borrow counts for past 7 days
   ```

6. UI Components:
   ```
   Build React components for book listing table, user dropdown, and borrowed books panel with proper state management
   ```

7. Admin Panel Implementation:
   ```
   Create admin dashboard with book and user management capabilities, including configurable borrowing limits
   ```

8. Enhanced Features:
   ```
   Add search and filtering for books, multiple book copies support, and improved UI/UX
   ```

## Project Structure

```
borrowing-insights/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API service functions
│   │   └── App.jsx      # Main application component
│   └── index.html       # HTML entry point
└── server/              # Node.js backend
    ├── config/          # Database configuration
    ├── controllers/     # Request handlers
    ├── middleware/      # Authentication middleware
    ├── models/          # Data models
    ├── routes/          # API routes
    └── index.js         # Server entry point
```

## How to Run

### Prerequisites
1. **Node.js** (v14 or higher)
2. **MongoDB** (local installation or MongoDB Atlas account)

### MongoDB Setup
1. Install MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following content:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/borrowing-insights
   JWT_SECRET=your_jwt_secret_here
   ```
4. Seed the database with sample data:
   ```bash
   npm run seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:5000

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The client will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

### Books
- `GET /api/books` - Get all books with availability status
- `POST /api/books/borrow` - Borrow a book (requires authentication)
- `POST /api/books/return` - Return a book (requires authentication)
- `GET /api/books/borrowed` - Get borrowed books for authenticated user
- `POST /api/books/admin` - Create a new book (admin only)
- `PUT /api/books/admin/:id` - Update a book (admin only)
- `DELETE /api/books/admin/:id` - Delete a book (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get a user by ID (admin only)
- `PUT /api/users/:id/borrowing-limit` - Update user borrowing limit (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)
- `GET /api/users/borrowing-info` - Get borrowing info for authenticated user

### Analytics
- `GET /api/analytics/top-users` - Get top 3 users by borrowed books (requires authentication)
- `GET /api/analytics/daily-borrows` - Get daily borrow counts for past 7 days (requires authentication)

## Features

1. **Authentication**:
   - User login and registration
   - JWT-based authentication
   - Protected routes
   - Admin role support (first user or user with admin@example.com)

2. **Borrowing Logic**:
   - Users can borrow up to 2 books (configurable 1-10)
   - Books show availability status with multiple copies support
   - Error handling for borrowing limits
   - Search and filter functionality for books

3. **Return Management**:
   - Users can return borrowed books
   - Book availability updates in real-time
   - Multiple copies tracking

4. **Analytics**:
   - Top users by borrowed books
   - Daily borrow counts
   - Real-time statistics

5. **Admin Panel**:
   - Book management (add, edit, delete)
   - User management (view, delete, configure borrowing limits)
   - Dashboard view with all system information

6. **Frontend**:
   - Responsive UI with TailwindCSS
   - Real-time updates after borrowing/returning
   - User-friendly interface with clear status indicators
   - Search and filtering capabilities
   - Role-based access control (user vs admin views)

## Security Features

1. **Authentication Middleware**:
   - JWT token verification
   - Protected routes for sensitive operations
   - User context in requests
   - Admin access control

2. **Data Validation**:
   - Input validation for all endpoints
   - Password hashing with bcrypt
   - Proper error handling
   - Borrowing limit enforcement (1-10 books)

## Database Schema

### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `borrowingLimit`: Number (default: 2, min: 1, max: 10)
- `borrowedBooks`: Array of Book references
- `timestamps`: Created and updated timestamps

### Book
- `name`: String (required)
- `author`: String (required)
- `price`: Number (required)
- `totalCopies`: Number (default: 1, min: 1)
- `availableCopies`: Number (default: 1, min: 0)
- `borrowedCopies`: Array of objects containing user reference and borrowed date
- `timestamps`: Created and updated timestamps

## Sample Data

The application comes with pre-seeded sample data including:
- 1 Admin user (admin@example.com / admin123)
- 5 Regular users with varying borrowing limits
- 6 Books with multiple copies each

## Usage Instructions

1. **Admin Access**:
   - Login with admin@example.com / admin123
   - Access the admin dashboard to manage books and users
   - Configure borrowing limits for users (1-10 books)

2. **Regular User Access**:
   - Register a new account or login with sample credentials
   - Select a user from the dropdown
   - Browse available books using search and filters
   - Borrow/return books within your borrowing limit
   - View your borrowed books and return them as needed

3. **Book Management**:
   - Admins can add new books with specified number of copies
   - Admins can edit existing book details
   - Admins can delete books (only if not currently borrowed)

4. **User Management**:
   - Admins can view all users in the system
   - Admins can configure borrowing limits for each user
   - Admins can delete users (only if they have no borrowed books)