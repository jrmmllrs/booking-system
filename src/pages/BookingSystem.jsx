// src/pages/BookingSystem.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, User, LogOut, XCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import LoginForm from '../components/LoginForm';
import BookingCard from '../components/BookingCard';

const BookingSystem = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'consultation',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setInitializing(false);
      if (!user) {
        setBookings([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      const bookingsList = [];
      snapshot.forEach((doc) => {
        bookingsList.push({ id: doc.id, ...doc.data() });
      });
      
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
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
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
      await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
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
      await signOut(auth);
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
      const booking = {
        ...formData,
        userId: user.uid,
        status: 'pending',
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'bookings'), booking);
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
      await updateDoc(doc(db, 'bookings', id), {
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

  if (initializing) {
    return <LoadingSpinner message="Initializing..." />;
  }

  if (!user) {
    return (
      <LoginForm
        email={loginEmail}
        setEmail={setLoginEmail}
        password={loginPassword}
        setPassword={setLoginPassword}
        onLogin={handleLogin}
        onSignup={handleSignup}
        loading={loading}
        error={error}
        isAdmin={false}
      />
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

        <ErrorAlert message={error} />

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
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={cancelBooking}
                  loading={loading}
                  isAdmin={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;