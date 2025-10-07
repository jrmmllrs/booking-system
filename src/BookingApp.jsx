import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, XCircle, LogOut, AlertCircle } from 'lucide-react';

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

const BookingSystem = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'consultation',
    date: '',
    time: '',
    notes: ''
  });

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
            if (user) {
              setUser(user);
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

  // Load bookings when user changes
  useEffect(() => {
    if (user && firebaseInitialized) {
      loadBookings();
    }
  }, [user, firebaseInitialized]);

const loadBookings = async () => {
    try {
      const db = window.firebase.firestore();
      const snapshot = await db.collection('bookings')
        .where('userId', '==', user.uid)
        .get();
      
      const bookingsList = [];
      snapshot.forEach((doc) => {
        bookingsList.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort in JavaScript instead of Firestore to avoid index requirement
      bookingsList.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.seconds - a.createdAt.seconds;
      });
      
      setBookings(bookingsList);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load bookings');
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
      await window.firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword);
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

  const handleSignup = async () => {
    if (!loginEmail || !loginPassword) {
      setError('Please enter email and password');
      return;
    }

    if (loginPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await window.firebase.auth().createUserWithEmailAndPassword(loginEmail, loginPassword);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Try logging in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
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
      setShowBookingForm(false);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const db = window.firebase.firestore();
      const booking = {
        ...formData,
        userId: user.uid,
        status: 'pending',
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
      };
      
      await db.collection('bookings').add(booking);
      await loadBookings();
      setShowBookingForm(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'consultation',
        date: '',
        time: '',
        notes: ''
      });
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    setLoading(true);
    setError('');

    try {
      const db = window.firebase.firestore();
      await db.collection('bookings').doc(id).update({
        status: 'cancelled'
      });
      await loadBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  if (!firebaseInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing Firebase...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Booking System</h1>
            <p className="text-gray-600 mt-2">Sign in to manage your appointments</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your email"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Sign In'}
              </button>
              <button
                onClick={handleSignup}
                disabled={loading}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign Up
              </button>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-6">
            New user? Click Sign Up to create an account
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Welcome back!</h2>
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

        {!showBookingForm && (
          <button
            onClick={() => setShowBookingForm(true)}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-semibold hover:bg-indigo-700 transition-colors mb-6 shadow-lg"
          >
            + New Booking
          </button>
        )}

        {showBookingForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Create New Booking</h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  <select
                    value={formData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="meeting">Meeting</option>
                    <option value="training">Training</option>
                    <option value="support">Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Any special requirements or notes..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Booking'}
                </button>
                <button
                  onClick={() => setShowBookingForm(false)}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Bookings</h3>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No bookings yet. Create your first booking!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
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
                    
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
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
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">{booking.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;