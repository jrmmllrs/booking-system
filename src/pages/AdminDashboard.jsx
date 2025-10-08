// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Calendar, User, LogOut, Filter, Mail } from "lucide-react";
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
  query,
  orderBy,
} from "firebase/firestore";
import { ADMIN_EMAILS } from "../constants";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";
import LoginForm from "../components/login/LoginForm";
import BookingCard from "../components/cards/BookingCard";
import ContactCard from "../components/cards/ContactCard";

const AdminDashboard = () => {
  // Auth State
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [initializing, setInitializing] = useState(true);

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  // Contacts State
  const [contacts, setContacts] = useState([]);
  const [contactFilter, setContactFilter] = useState("all");

  // UI State
  const [activeTab, setActiveTab] = useState("bookings");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auth Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        setUser(currentUser);
      } else if (currentUser && !ADMIN_EMAILS.includes(currentUser.email)) {
        setError("Access denied. Admin privileges required.");
        signOut(auth);
        setUser(null);
      } else {
        setUser(null);
        setBookings([]);
        setContacts([]);
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  // Load Data Effect
  useEffect(() => {
    if (user) {
      loadAllBookings();
      loadAllContacts();
    }
  }, [user]);

  // Data Loading Functions
  const loadAllBookings = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "bookings"));
      const bookingsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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

  const loadAllContacts = async () => {
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const contactsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContacts(contactsList);
    } catch (err) {
      console.error("Error loading contacts:", err);
      setError("Failed to load contact messages");
    }
  };

  // Auth Handlers
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
      setError(
        err.code === "auth/user-not-found" || err.code === "auth/wrong-password"
          ? "Invalid email or password"
          : err.code === "auth/invalid-email"
          ? "Invalid email format"
          : err.message
      );
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

  // Booking Handlers
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
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

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

  // Contact Handlers
  const markContactAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "contacts", id), {
        status: "read",
        updatedAt: serverTimestamp(),
      });
      await loadAllContacts();
    } catch (err) {
      console.error("Error updating contact:", err);
      setError("Failed to update contact status");
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      await deleteDoc(doc(db, "contacts", id));
      await loadAllContacts();
    } catch (err) {
      console.error("Error deleting contact:", err);
      setError("Failed to delete contact message");
    }
  };

  // Stats Calculations
  const bookingStats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const contactStats = {
    total: contacts.length,
    unread: contacts.filter((c) => c.status === "unread").length,
    read: contacts.filter((c) => c.status === "read").length,
  };

  // Filtered Data
  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  const filteredContacts =
    contactFilter === "all"
      ? contacts
      : contacts.filter((c) => c.status === contactFilter);

  // Render Guards
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === "bookings"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Bookings
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors relative ${
              activeTab === "contacts"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Mail className="w-5 h-5 inline mr-2" />
            Contact Messages
            {contactStats.unread > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {contactStats.unread}
              </span>
            )}
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <>
            {/* Booking Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                value={bookingStats.total}
                label="Total Bookings"
                color="gray"
              />
              <StatCard
                value={bookingStats.pending}
                label="Pending"
                color="yellow"
              />
              <StatCard
                value={bookingStats.confirmed}
                label="Confirmed"
                color="green"
              />
              <StatCard
                value={bookingStats.cancelled}
                label="Cancelled"
                color="red"
              />
            </div>

            {/* Booking Filter */}
            <FilterBar
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "All Bookings" },
                { value: "pending", label: "Pending" },
                { value: "confirmed", label: "Confirmed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />

            {/* Bookings List */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                All Bookings
              </h3>

              {loading && filteredBookings.length === 0 ? (
                <LoadingState message="Loading bookings..." />
              ) : filteredBookings.length === 0 ? (
                <EmptyState icon={Calendar} message="No bookings found" />
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
          </>
        )}

        {/* Contacts Tab */}
        {activeTab === "contacts" && (
          <>
            {/* Contact Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatCard
                value={contactStats.total}
                label="Total Messages"
                color="gray"
              />
              <StatCard
                value={contactStats.unread}
                label="Unread"
                color="blue"
              />
              <StatCard value={contactStats.read} label="Read" color="green" />
            </div>

            {/* Contact Filter */}
            <FilterBar
              value={contactFilter}
              onChange={setContactFilter}
              options={[
                { value: "all", label: "All Messages" },
                { value: "unread", label: "Unread" },
                { value: "read", label: "Read" },
              ]}
            />

            {/* Contacts List */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Contact Messages
              </h3>

              {filteredContacts.length === 0 ? (
                <EmptyState icon={Mail} message="No messages found" />
              ) : (
                <div className="space-y-4">
                  {filteredContacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onMarkAsRead={markContactAsRead}
                      onDelete={deleteContact}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ value, label, color }) => {
  const colorClasses = {
    gray: "text-gray-800",
    yellow: "text-yellow-600",
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

const FilterBar = ({ value, onChange, options }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
    <div className="flex items-center space-x-4">
      <Filter className="w-5 h-5 text-gray-600" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const LoadingState = ({ message }) => (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
    <p className="mt-4 text-gray-600">{message}</p>
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="text-center py-12">
    <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <p className="text-gray-500">{message}</p>
  </div>
);

export default AdminDashboard;
