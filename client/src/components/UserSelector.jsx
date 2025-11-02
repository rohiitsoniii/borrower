import React from 'react';

const UserSelector = ({ selectedUser, onUserSelect, currentUser }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">User Selection</h3>
          <p className="mt-1 text-sm text-gray-500">
            Currently viewing as: <span className="font-medium">{currentUser?.name || 'No user selected'}</span>
          </p>
        </div>
        <div className="flex items-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            Borrowing limit: {currentUser?.borrowingLimit || 2} books
          </span>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-medium">
              {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{currentUser?.name || 'No user selected'}</p>
            <p className="text-sm text-gray-500">{currentUser?.email || 'Select a user to continue'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSelector;