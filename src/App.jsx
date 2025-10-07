// src/App.jsx
import React, { useState } from 'react';
import BookingSystem from './pages/BookingSystem';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  return (
    <div className="relative">
      {/* Mode Toggle Button - Fixed at top right */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsAdminMode(!isAdminMode)}
          className="bg-white shadow-lg rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200"
        >
          Switch to {isAdminMode ? 'User' : 'Admin'} View
        </button>
      </div>

      {/* Render based on mode */}
      {isAdminMode ? <AdminDashboard /> : <BookingSystem />}
    </div>
  );
}

export default App;