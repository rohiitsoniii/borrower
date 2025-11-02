import React, { useState, useEffect } from 'react';
import { getUsers } from '../services/api';

const UserSelector = ({ selectedUser, onUserSelect, currentUser }) => {
  // For regular users, they can only select themselves
  // For admin, they can select any user (but we'll handle that separately)
  
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="user-select" className="block text-sm font-medium text-gray-700">
          Selected User
        </label>
        <span className="text-xs text-gray-500">A user can borrow up to {currentUser?.borrowingLimit || 2} books</span>
      </div>
      <div className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md bg-gray-50">
        {currentUser?.name || 'No user selected'}
      </div>
    </div>
  );
};

export default UserSelector;