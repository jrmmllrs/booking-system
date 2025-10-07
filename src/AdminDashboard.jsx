import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, LogOut, AlertCircle, CheckCircle, XCircle, Filter } from 'lucide-react';

// Import Firebase SDK from CDN
const script1 = document.createElement('script');
script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.0/firebase-app-compat.min.js';
document.head.appendChild(script1);

const script2 = document.createElement('script');
script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.0/firebase-auth-compat.min.js';
document.head.appendChild(script2);

const script3 = document.createElement('script');
script3.src = 'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.0/firebase-firestore-compat.min.js';
document.head.appendChild(script3);

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  // List of admin emails (you can modify this)
  const ADMIN_EMAILS = ['admin@homeserbase.com', 'jmillares0945@gmail.com'];

  // Initialize Firebase
  useEffect(() => {
    const initFirebase = () => {
      if (window.firebase && !firebaseInitialized) {
        try {
          const firebaseConfig = {
            apiKey: "AIzaSyBAbZGGA4umqdUXextUC-dX_GZ6YPLe3fg",
            authDomain: "homeserbase.firebaseapp.com",
            projectId: "homeserbase",
            storageBucket: "homeserbase.firebasestorage.app",
            messagingSenderId: "570650478517",
            appId: "1:570650478517:web:d6f5d30835d142cec6fbfc"
          };

          if (!window.firebase.apps.length) {
            window.firebase.initializeApp(firebaseConfig);
          }
          setFirebaseInitialized(true);

          // Listen for auth state changes
          window.firebase.auth().onAuthStateChanged((user) => {
            if (user && ADMIN_EMAILS.includes(user.email)) {
              setUser(user);
            } else if (user && !ADMIN_EMAILS.includes(user.email)) {
              setError('Access denied. Admin privileges required.');
              window.firebase.auth().signOut();
              setUser(null);
            } else {
              setUser(null);
              setBookings([]);
            }
          });
        } catch (err) {
          console.error('Firebase initialization error:', err);
          setError('Failed to initialize Firebase');
        }
      }
    };

    const timer = setInterval(() => {
      if (window.firebase) {
        initFirebase();
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [firebaseInitialized]);

  // Load all bookings when user changes
  useEffect(() => {
    if (user && firebaseInitialized) {
      loadAllBookings();
    }
  }, [user, firebaseInitialized]);

  // Filter bookings when status filter changes
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.status === statusFilter));
    }
  }, [statusFilter, bookings]);

  const loadAllBookings = async () => {
    setLoading(true);
    try {
      const db = window.firebase.firestore();
      const snapshot = await db.collection('bookings').get();
      
      const bookingsList = [];
      snapshot.forEach((doc) => {
        bookingsList.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by creation date
      bookingsList.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.seconds - a.createdAt.seconds;
      });
      
      setBookings(bookingsList);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await window.firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword);
      
      if (!ADMIN_EMAILS.includes(result.user.email)) {
        setError('Access denied. Admin privileges required.');
        await window.firebase.auth().signOut();
        return;
      }
      
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await window.firebase.auth().signOut();
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    }
  };

  const updateBookingStatus = async (id, newStatus) => {
    setLoading(true);
    setError('');

    try {
      const db = window.firebase.firestore();
      await db.collection('bookings').doc(id).update({
        status: newStatus,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });
      await loadAllBookings();
    } catch (err) {
      console.error('Error updating booking:', err);
      setError('Failed to update booking status');
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const db = window.firebase.firestore();
      await db.collection('bookings').doc(id).delete();
      await loadAllBookings();
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to delete booking');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStats = () => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };
  };

  if (!firebaseInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing Firebase...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Sign in with admin credentials</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">All Bookings</h3>
          
          {loading && filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No bookings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        booking.status === 'pending' ? 'bg-yellow-400' :
                        booking.status === 'confirmed' ? 'bg-green-400' :
                        'bg-red-400'
                      }`} />
                      <span className="font-semibold text-gray-800 capitalize">{booking.service}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{booking.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{booking.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{booking.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{booking.time}</span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{booking.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    {booking.status !== 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        disabled={loading}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirm</span>
                      </button>
                    )}
                    {booking.status !== 'pending' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'pending')}
                        disabled={loading}
                        className="flex items-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Set Pending</span>
                      </button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        disabled={loading}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      disabled={loading}
                      className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50 ml-auto"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;