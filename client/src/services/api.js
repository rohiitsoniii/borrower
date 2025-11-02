const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add authorization header if token exists
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Auth APIs
export const login = (credentials) => apiCall('/users/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
});

export const register = (userData) => apiCall('/users/register', {
  method: 'POST',
  body: JSON.stringify(userData),
});

// User APIs
export const getUsers = () => apiCall('/users');
export const getUserById = (id) => apiCall(`/users/${id}`);
export const updateUserBorrowingLimit = (id, borrowingLimit) => apiCall(`/users/${id}/borrowing-limit`, {
  method: 'PUT',
  body: JSON.stringify({ borrowingLimit }),
});
export const deleteUser = (id) => apiCall(`/users/${id}`, {
  method: 'DELETE',
});

// Book APIs
export const getBooks = () => apiCall('/books');
export const createBook = (bookData) => apiCall('/books/admin', {
  method: 'POST',
  body: JSON.stringify(bookData),
});
export const updateBook = (id, bookData) => apiCall(`/books/admin/${id}`, {
  method: 'PUT',
  body: JSON.stringify(bookData),
});
export const deleteBook = (id) => apiCall(`/books/admin/${id}`, {
  method: 'DELETE',
});
export const borrowBook = (bookId) => apiCall('/books/borrow', {
  method: 'POST',
  body: JSON.stringify({ bookId }),
});
export const returnBook = (bookId) => apiCall('/books/return', {
  method: 'POST',
  body: JSON.stringify({ bookId }),
});
export const getUserBorrowedBooks = () => apiCall('/books/borrowed', {
  method: 'GET'
});

// Analytics APIs
export const getTopUsers = () => apiCall('/analytics/top-users');
export const getDailyBorrows = () => apiCall('/analytics/daily-borrows');