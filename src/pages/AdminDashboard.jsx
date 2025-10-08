// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Calendar, User, LogOut, Filter } from "lucide-react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ADMIN_EMAILS } from "../constants";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";
import LoginForm from "../components/login/LoginForm";
import BookingCard from "../components/admin/BookingCard";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && ADMIN_EMAILS.includes(user.email)) {
        setUser(user);
      } else if (user && !ADMIN_EMAILS.includes(user.email)) {
        setError("Access denied. Admin privileges required.");
        signOut(auth);
        setUser(null);
      } else {
        setUser(null);
        setBookings([]);
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadAllBookings();
    }
  }, [user]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === statusFilter));
    }
  }, [statusFilter, bookings]);

  const loadAllBookings = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "bookings"));

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
      console.error("Error loading bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );

      if (!ADMIN_EMAILS.includes(result.user.email)) {
        setError("Access denied. Admin privileges required.");
        await signOut(auth);
        return;
      }

      setLoginEmail("");
      setLoginPassword("");
    } catch (err) {
      console.error("Login error:", err);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format");
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
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout");
    }
  };

  const updateBookingStatus = async (id, newStatus) => {
    setLoading(true);
    setError("");

    try {
      await updateDoc(doc(db, "bookings", id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      await loadAllBookings();
    } catch (err) {
      console.error("Error updating booking:", err);
      setError("Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await deleteDoc(doc(db, "bookings", id));
      await loadAllBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
      setError("Failed to delete booking");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStats = () => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };
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
        loading={loading}
        error={error}
        isAdmin={true}
      />
    );
  }

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Admin Dashboard
                </h2>
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-gray-800">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-green-600">
              {stats.confirmed}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-red-600">
              {stats.cancelled}
            </div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

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

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            All Bookings
          </h3>

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
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={(id) => updateBookingStatus(id, "cancelled")}
                  onConfirm={(id) => updateBookingStatus(id, "confirmed")}
                  onSetPending={(id) => updateBookingStatus(id, "pending")}
                  onDelete={deleteBooking}
                  loading={loading}
                  isAdmin={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;