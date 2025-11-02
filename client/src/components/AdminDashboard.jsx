import React, { useState, useEffect } from 'react';
import { getUsers, getUserById, updateUserBorrowingLimit, deleteUser } from '../services/api';
import { getBooks, createBook, updateBook, deleteBook } from '../services/api';

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Book form state
  const [bookForm, setBookForm] = useState({
    name: '',
    author: '',
    price: '',
    totalCopies: 1
  });
  
  // Editing state
  const [editingBook, setEditingBook] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, booksData] = await Promise.all([
        getUsers(),
        getBooks()
      ]);
      setUsers(usersData);
      setBooks(booksData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        ...bookForm,
        price: parseFloat(bookForm.price),
        totalCopies: parseInt(bookForm.totalCopies)
      };
      await createBook(bookData);
      setBookForm({ name: '', author: '', price: '', totalCopies: 1 });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        name: bookForm.name,
        author: bookForm.author,
        price: parseFloat(bookForm.price),
        totalCopies: parseInt(bookForm.totalCopies)
      };
      await updateBook(editingBook._id, bookData);
      setEditingBook(null);
      setBookForm({ name: '', author: '', price: '', totalCopies: 1 });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setBookForm({
      name: book.name,
      author: book.author,
      price: book.price,
      totalCopies: book.totalCopies
    });
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
    setBookForm({ name: '', author: '', price: '', totalCopies: 1 });
  };

  const handleUpdateUserLimit = async (userId, newLimit) => {
    try {
      await updateUserBorrowingLimit(userId, newLimit);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          <p className="text-gray-600 mt-2">Manage books and users</p>
        </header>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Books Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Books Management</h2>
            
            {/* Book Form */}
            <form onSubmit={editingBook ? handleUpdateBook : handleCreateBook} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book Name
                  </label>
                  <input
                    type="text"
                    value={bookForm.name}
                    onChange={(e) => setBookForm({...bookForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={bookForm.price}
                    onChange={(e) => setBookForm({...bookForm, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Copies
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bookForm.totalCopies}
                    onChange={(e) => setBookForm({...bookForm, totalCopies: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
                {editingBook && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Books List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr key={book._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {book.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${book.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          book.availableCopies > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.availableCopies} of {book.totalCopies} available
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleEditBook(book)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Users Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Users Management</h2>
            
            {/* Users List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Borrowing Limit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Books Borrowed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {editingUser === user._id ? (
                          <div className="flex">
                            <input
                              type="number"
                              min="1"
                              max="10"
                              defaultValue={user.borrowingLimit}
                              className="w-16 px-2 py-1 border border-gray-300 rounded"
                              id={`limit-${user._id}`}
                            />
                            <button
                              onClick={() => {
                                const newLimit = document.getElementById(`limit-${user._id}`).value;
                                handleUpdateUserLimit(user._id, parseInt(newLimit));
                                setEditingUser(null);
                              }}
                              className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="ml-1 px-2 py-1 bg-gray-500 text-white rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span>{user.borrowingLimit}</span>
                            <button
                              onClick={() => setEditingUser(user._id)}
                              className="ml-2 text-blue-600 hover:text-blue-900 text-xs"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.borrowedBooks?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={user.borrowedBooks?.length > 0}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;