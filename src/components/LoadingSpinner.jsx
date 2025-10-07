// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;