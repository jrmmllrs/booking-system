// src/App.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { ADMIN_EMAILS } from './constants';
import DentalClinicWebsite from './pages/BookingSystem';
import AdminDashboard from './pages/AdminDashboard';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // Check if user is admin
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing) {
    return <LoadingSpinner />;
  }

  // Route to Admin Dashboard if user is logged in and is admin
  if (user && isAdmin) {
    return <AdminDashboard />;
  }

  // Otherwise show the regular booking system (landing page + user dashboard)
  return <DentalClinicWebsite />;
}

export default App;