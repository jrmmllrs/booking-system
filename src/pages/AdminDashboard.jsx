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
import AnalyticsDashboard from "../components/dashboard/AnalyticsDashboard";
import SearchFilter from "../components/dashboard/SearchFilter";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import StatusOverview from "../components/dashboard/StatusOverview";

const AdminDashboard = () => {
  // Auth State
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [initializing, setInitializing] = useState(true);

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Contacts State
  const [contacts, setContacts] = useState([]);
  const [contactFilter, setContactFilter] = useState("all");

  // UI State
  const [activeTab, setActiveTab] = useState("overview");
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

  // Quick Actions Handlers
  const handleExport = () => {
    const csv =
      "Name,Email,Phone,Service,Date,Time,Status,Notes\n" +
      bookings
        .map(
          (b) =>
            `"${b.name}","${b.email}","${b.phone || ""}","${b.service}","${
              b.date
            }","${b.time}","${b.status}","${b.notes || ""}"`
        )
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    await loadAllBookings();
    await loadAllContacts();
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
  const filteredBookings = bookings
    .filter((b) => statusFilter === "all" || b.status === statusFilter)
    .filter(
      (b) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-white via-white to-indigo-50/30 rounded-3xl shadow-2xl p-8 mb-6 border border-gray-200/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-medium shadow-md"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <ErrorAlert message={error} />

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-6 flex gap-2 border border-gray-200/50">
          {["overview", "bookings", "contacts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "contacts" && contactStats.unread > 0 && (
                <span className="ml-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                  {contactStats.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <StatusOverview
              bookingStats={bookingStats}
              contactStats={contactStats}
            />

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AnalyticsDashboard bookings={bookings} />
              </div>
              <div className="space-y-6">
                <QuickActions
                  onExport={handleExport}
                  onRefresh={handleRefresh}
                  bookingsCount={bookings.length}
                  contactsCount={contacts.length}
                />
                <ActivityTimeline bookings={bookings} contacts={contacts} />
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search bookings by name, email, or service..."
            />

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200/50">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                  <Filter className="w-5 h-5 text-indigo-600" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm font-medium"
                >
                  <option value="all">All Bookings</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {loading && filteredBookings.length === 0 ? (
                <LoadingSpinner message="Loading bookings..." />
              ) : filteredBookings.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-200/50">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No bookings found</p>
                </div>
              ) : (
                filteredBookings.map((booking) => (
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
                ))
              )}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === "contacts" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200/50">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                  <Filter className="w-5 h-5 text-indigo-600" />
                </div>
                <select
                  value={contactFilter}
                  onChange={(e) => setContactFilter(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm font-medium"
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredContacts.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-200/50">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No messages found</p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onMarkAsRead={markContactAsRead}
                    onDelete={deleteContact}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
