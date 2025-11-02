import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserSelector from './components/UserSelector';
import BookList from './components/BookList';
import BorrowedBooks from './components/BorrowedBooks';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userString = localStorage.getItem('user');
        if (userString) {
          const storedUser = JSON.parse(userString);
          setCurrentUser(storedUser);
          
          // Check if user is admin (first user or has admin email)
          if (storedUser.email === 'admin@example.com') {
            setIsAdmin(true);
          } else {
            // For regular users, set selected user to current user
            setSelectedUser(storedUser);
          }
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', user.token);
    
    // Check if user is admin
    if (user.email === 'admin@example.com') {
      setIsAdmin(true);
    } else {
      // For regular users, set selected user to current user
      setSelectedUser(user);
    }
  };

  const handleRegister = (user) => {
    // After registration, switch to login
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setSelectedUser(null);
    setIsAdmin(false);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleBookAction = () => {
    // Trigger a refresh of all components
    setRefreshKey(prev => prev + 1);
  };

  // If user is not logged in, show login/register
  if (!currentUser) {
    return showRegister ? (
      <Register onRegister={handleRegister} onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onLogin={handleLogin} />
    );
  }

  // If user is admin, show admin dashboard
  if (isAdmin) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Regular user interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex justify-between items-center bg-white rounded-xl shadow-lg p-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Library Borrowing System</h1>
              <p className="text-gray-600 mt-2">Manage book borrowing and returns</p>
            </div>
            <div className="text-right">
              <p className="text-gray-700 font-medium">Welcome, {currentUser.name}</p>
              <button
                onClick={handleLogout}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main>
          <UserSelector 
            selectedUser={selectedUser} 
            currentUser={currentUser}
            onUserSelect={handleUserSelect} 
          />
          
          <div className="mt-8 space-y-8">
            <BookList 
              selectedUser={selectedUser} 
              onBookAction={handleBookAction}
              key={`booklist-${refreshKey}`}
            />
            
            <BorrowedBooks 
              selectedUser={selectedUser} 
              onBookAction={handleBookAction}
              key={`borrowed-${refreshKey}`}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;