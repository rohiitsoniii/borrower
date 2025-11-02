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
    console.log('Token from localStorage:', token);
    if (token) {
      // In a real app, you would validate the token with the server
      // For now, we'll just check if it exists
      try {
        const userString = localStorage.getItem('user');
        console.log('User string from localStorage:', userString);
        if (userString) {
          const storedUser = JSON.parse(userString);
          console.log('Stored user from localStorage:', storedUser);
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
    console.log('User data from login:', user);
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Library Borrowing System</h1>
              <p className="text-gray-600 mt-2">Manage book borrowing and returns</p>
            </div>
            <div className="text-right">
              <p className="text-gray-700">Welcome, {currentUser.name}</p>
              <button
                onClick={handleLogout}
                className="mt-1 text-sm text-indigo-600 hover:text-indigo-800"
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
        </main>
      </div>
    </div>
  );
}

export default App;