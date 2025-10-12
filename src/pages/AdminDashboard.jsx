// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Calendar, User, LogOut, Filter, Mail, MapPin } from "lucide-react";
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
import AdminBookingList from "../components/cards/AdminBookingList";
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
  const [branchFilter, setBranchFilter] = useState("all");
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
      "Name,Email,Phone,Branch,Service,Date,Time,Status,Notes\n" +
      filteredBookings
        .map(
          (b) =>
            `"${b.name}","${b.email}","${b.phone || ""}","${b.branch || ""}","${
              b.service
            }","${b.date}","${b.time}","${b.status}","${b.notes || ""}"`
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

  // Stats Calculations - Updated to include branch filtering
  const bookingStats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    villasis: bookings.filter((b) => b.branch === "villasis").length,
    carmen: bookings.filter((b) => b.branch === "carmen").length,
  };

  const contactStats = {
    total: contacts.length,
    unread: contacts.filter((c) => c.status === "unread").length,
    read: contacts.filter((c) => c.status === "read").length,
  };

  // Filtered Data - Updated to include branch filter
  const filteredBookings = bookings
    .filter((b) => statusFilter === "all" || b.status === statusFilter)
    .filter((b) => branchFilter === "all" || b.branch === branchFilter)
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
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 transition-all duration-300 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#0056A3] to-[#009846] rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Admin Dashboard
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group/btn relative overflow-hidden transition-all duration-500"
            >
              <div className="relative px-6 py-3 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-red-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <LogOut className="w-5 h-5 text-gray-600 group-hover/btn:text-white transition-colors duration-500" />
                  <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-white transition-colors duration-500">
                    Logout
                  </span>
                </div>
              </div>
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

            {/* Branch Stats Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">
                      Villasis Branch
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {bookingStats.villasis}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total Bookings</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">
                      Carmen Branch
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {bookingStats.carmen}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total Bookings</p>
                  </div>
                </div>
              </div>
            </div>

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
              <div className="grid md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                    <Filter className="w-5 h-5 text-indigo-600" />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Branch Filter */}
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm font-medium"
                  >
                    <option value="all">All Branches</option>
                    <option value="villasis">Villasis Branch</option>
                    <option value="carmen">Carmen Branch</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(statusFilter !== "all" || branchFilter !== "all") && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500 font-semibold">
                    Active Filters:
                  </span>
                  {statusFilter !== "all" && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                      Status: {statusFilter}
                    </span>
                  )}
                  {branchFilter !== "all" && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                      Branch:{" "}
                      {branchFilter === "villasis" ? "Villasis" : "Carmen"}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setBranchFilter("all");
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {loading && filteredBookings.length === 0 ? (
              <LoadingSpinner message="Loading bookings..." />
            ) : (
              <>
                <div className="bg-white rounded-xl p-4 border border-gray-200/50">
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-bold text-gray-900">
                      {filteredBookings.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-gray-900">
                      {bookings.length}
                    </span>{" "}
                    bookings
                  </p>
                </div>
                <AdminBookingList
                  bookings={filteredBookings}
                  onCancel={(id) => updateBookingStatus(id, "cancelled")}
                  onConfirm={(id) => updateBookingStatus(id, "confirmed")}
                  onSetPending={(id) => updateBookingStatus(id, "pending")}
                  onDelete={deleteBooking}
                  loading={loading}
                />
              </>
            )}
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
