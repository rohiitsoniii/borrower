import React, { useState, useEffect } from 'react';
import { getUserBorrowedBooks, returnBook } from '../services/api';

const BorrowedBooks = ({ selectedUser, onBookAction }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (!selectedUser) {
        setBorrowedBooks([]);
        setLoading(false);
        return;
      }

      try {
        const books = await getUserBorrowedBooks();
        setBorrowedBooks(books);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, [selectedUser, onBookAction]);

  const handleReturn = async (bookId) => {
    if (!selectedUser) return;

    try {
      await returnBook(bookId);
      onBookAction(); // Refresh the data
    } catch (error) {
      alert(error.message);
    }
  };

  if (!selectedUser) {
    return (
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Borrowed Books</h2>
        <p className="text-gray-500">Please select a user to view borrowed books</p>
      </div>
    );
  }

  if (loading) {
    return <div className="mt-6 p-4 bg-white rounded-lg shadow">Loading borrowed books...</div>;
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Borrowed Books by {selectedUser.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {borrowedBooks.length} book(s) borrowed
        </p>
      </div>
      {borrowedBooks.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No books borrowed yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrowed Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {borrowedBooks.map((book) => (
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
                    {book.borrowedDate ? new Date(book.borrowedDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleReturn(book._id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded"
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BorrowedBooks;