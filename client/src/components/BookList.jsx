import React, { useState, useEffect } from 'react';
import { getBooks, borrowBook } from '../services/api';

const BookList = ({ selectedUser, onBookAction }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const bookData = await getBooks();
        setBooks(bookData);
        setFilteredBooks(bookData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [onBookAction]);

  // Filter books based on search term and availability
  useEffect(() => {
    let result = books;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(book => 
        book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply availability filter
    if (availabilityFilter === 'available') {
      result = result.filter(book => book.availableCopies > 0);
    } else if (availabilityFilter === 'borrowed') {
      result = result.filter(book => book.availableCopies === 0);
    }
    
    setFilteredBooks(result);
  }, [searchTerm, availabilityFilter, books]);

  const handleBorrow = async (bookId) => {
    if (!selectedUser) {
      alert('Please select a user first');
      return;
    }

    try {
      await borrowBook(bookId);
      onBookAction(); // Refresh the data
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="p-4">Loading books...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Available Books</h2>
        
        {/* Search and Filter Controls */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by book name or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Books</option>
              <option value="available">Available Only</option>
              <option value="borrowed">Borrowed Only</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {filteredBooks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm || availabilityFilter !== 'all' 
              ? 'No books match your search criteria' 
              : 'No books available'}
          </div>
        ) : (
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
                  Availability
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
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
                      onClick={() => handleBorrow(book._id)}
                      disabled={book.availableCopies <= 0 || !selectedUser}
                      className={`px-3 py-1 rounded ${
                        book.availableCopies <= 0 || !selectedUser
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {book.availableCopies <= 0 ? 'Not Available' : 'Borrow'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookList;