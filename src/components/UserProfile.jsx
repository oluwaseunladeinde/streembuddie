import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-3 cursor-pointer group">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
          <span className="text-white font-medium text-sm">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
        <div className="hidden md:block">
          <div className="text-sm font-medium text-gray-700">{currentUser.name}</div>
          <div className="text-xs text-gray-500">{currentUser.email}</div>
        </div>
      </div>

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
          <div className="text-xs text-gray-500 truncate">{currentUser.email}</div>
        </div>
        <button
          onClick={logout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;