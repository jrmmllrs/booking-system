// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  LogOut,
  Filter,
  Mail,
  MapPin,
  CheckCircle2,
  Download,
  RefreshCw,
  BarChart3,
  MessageSquare,
  Settings,
  ChevronRight,
  Clock,
  Users,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  Eye,
  Phone,
  FileText,
} from "lucide-react";
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
  addDoc,
} from "firebase/firestore";
import { ADMIN_EMAILS } from "../constants";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";
import LoginForm from "../components/login/LoginForm";
import AdminBookingList from "../components/admin/bookings/AdminBookingList";
import ContactCard from "../components/admin/contacts/ContactCard";

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
  const [successMessage, setSuccessMessage] = useState("");

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

  // Auto-clear messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
      setSuccessMessage(`Booking ${newStatus} successfully!`);
    } catch (err) {
      console.error("Error updating booking:", err);
      setError("Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id, cancelReason) => {
    setLoading(true);
    setError("");

    try {
      await updateDoc(doc(db, "bookings", id), {
        status: "cancelled",
        cancellationReason: cancelReason,
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await loadAllBookings();
      setSuccessMessage("Booking cancelled successfully!");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError("Failed to cancel booking");
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
      setSuccessMessage("Booking deleted successfully!");
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
      setSuccessMessage("Contact message deleted successfully!");
    } catch (err) {
      console.error("Error deleting contact:", err);
      setError("Failed to delete contact message");
    }
  };

  // Transfer Contact to Booking Handler
  const handleTransferToBooking = async (bookingData) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const bookingRef = await addDoc(collection(db, "bookings"), {
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        service: bookingData.service,
        branch: bookingData.branch,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        source: "contact-transfer",
        originalContactId: bookingData.contactId,
      });

      await updateDoc(doc(db, "contacts", bookingData.contactId), {
        status: "read",
        transferredToBooking: true,
        bookingId: bookingRef.id,
        updatedAt: serverTimestamp(),
      });

      await loadAllBookings();
      await loadAllContacts();

      setSuccessMessage(
        `Successfully transferred contact to booking! Booking ID: ${bookingRef.id.slice(
          0,
          8
        )}...`
      );
      setActiveTab("bookings");
    } catch (err) {
      console.error("Error transferring to booking:", err);
      setError("Failed to transfer contact to booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Quick Actions Handlers
  const handleExport = () => {
    const csv =
      "Name,Email,Phone,Branch,Service,Date,Time,Status,Notes,Cancellation Reason\n" +
      filteredBookings
        .map(
          (b) =>
            `"${b.name}","${b.email}","${b.phone || ""}","${b.branch || ""}","${
              b.service
            }","${b.date}","${b.time}","${b.status}","${b.notes || ""}","${
              b.cancellationReason || ""
            }"`
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
    setSuccessMessage("Data refreshed successfully!");
  };

  // Stats Calculations
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

  // Overview Calculations
  const getUpcomingBookings = () => {
    const today = new Date();
    return bookings
      .filter(b => b.status === "confirmed" || b.status === "pending")
      .filter(b => {
        const bookingDate = new Date(b.date);
        return bookingDate >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  };

  const getRecentBookings = () => {
    return bookings
      .sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.seconds - a.createdAt.seconds;
      })
      .slice(0, 5);
  };

  const getPopularServices = () => {
    const serviceCounts = {};
    bookings.forEach(booking => {
      serviceCounts[booking.service] = (serviceCounts[booking.service] || 0) + 1;
    });
    
    return Object.entries(serviceCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([service, count]) => ({ service, count }));
  };

  const upcomingBookings = getUpcomingBookings();
  const recentBookings = getRecentBookings();
  const popularServices = getPopularServices();

  // Filtered Data
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 text-sm font-medium">
              {successMessage}
            </p>
          </div>
        )}

        <ErrorAlert message={error} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <nav className="space-y-2">
                {[
                  { id: "overview", icon: BarChart3, label: "Overview", badge: null },
                  { id: "bookings", icon: Calendar, label: "Bookings", badge: bookingStats.total },
                  { id: "contacts", icon: MessageSquare, label: "Messages", badge: contactStats.unread },
                  { id: "settings", icon: Settings, label: "Settings", badge: null },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge > 0 && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activeTab === item.id 
                          ? "bg-blue-100 text-blue-600" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      activeTab === item.id ? "rotate-90" : ""
                    }`} />
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 mb-4">QUICK STATS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Bookings</span>
                    <span className="font-semibold text-gray-900">{bookingStats.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="font-semibold text-yellow-600">{bookingStats.pending}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Confirmed</span>
                    <span className="font-semibold text-green-600">{bookingStats.confirmed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Unread Messages</span>
                    <span className="font-semibold text-red-600">{contactStats.unread}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
                      <p className="text-blue-100">Here's what's happening with your health center today.</p>
                    </div>
                    <button
                      onClick={handleRefresh}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{bookingStats.total}</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">All time</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-1">{bookingStats.pending}</p>
                      </div>
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-yellow-600 font-medium">Needs attention</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Confirmed</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{bookingStats.confirmed}</p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">Ready to serve</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Unread Messages</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{contactStats.unread}</p>
                      </div>
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-red-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Eye className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">Requires review</span>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upcoming Bookings */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h3>
                      <button 
                        onClick={() => setActiveTab("bookings")}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        View all
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {upcomingBookings.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">No upcoming bookings</p>
                        </div>
                      ) : (
                        upcomingBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-8 rounded-full ${
                                booking.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                              }`} />
                              <div>
                                <p className="font-medium text-sm text-gray-900">{booking.name}</p>
                                <p className="text-xs text-gray-500">{booking.service} • {booking.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{booking.time}</p>
                              <p className="text-xs text-gray-500 capitalize">{booking.branch}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recent Activity & Popular Services */}
                  <div className="space-y-6">
                    {/* Recent Bookings */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                      <div className="space-y-3">
                        {recentBookings.length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-gray-500 text-sm">No recent bookings</p>
                          </div>
                        ) : (
                          recentBookings.map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between p-2">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-gray-900">{booking.name}</p>
                                  <p className="text-xs text-gray-500">{booking.service}</p>
                                </div>
                              </div>
                              <StatusBadge status={booking.status} />
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Popular Services */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Services</h3>
                      <div className="space-y-3">
                        {popularServices.length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-gray-500 text-sm">No service data</p>
                          </div>
                        ) : (
                          popularServices.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2">
                              <span className="text-sm text-gray-700 capitalize">{item.service}</span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                {item.count} bookings
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch Performance & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Branch Performance</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700 font-medium">Villasis Branch</span>
                        <span className="font-semibold text-gray-900">{bookingStats.villasis} bookings</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700 font-medium">Carmen Branch</span>
                        <span className="font-semibold text-gray-900">{bookingStats.carmen} bookings</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={handleExport}
                        className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
                      >
                        <Download className="w-5 h-5" />
                        <span>Export Bookings</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("bookings")}
                        className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
                      >
                        <Calendar className="w-5 h-5" />
                        <span>Manage Bookings</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("contacts")}
                        className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>View Messages</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Bookings Management</h2>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Filter className="w-5 h-5 text-gray-400" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <select
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Branches</option>
                        <option value="villasis">Villasis</option>
                        <option value="carmen">Carmen</option>
                      </select>
                    </div>
                  </div>

                  {loading && filteredBookings.length === 0 ? (
                    <LoadingSpinner message="Loading bookings..." />
                  ) : (
                    <>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          Showing <span className="font-semibold">{filteredBookings.length}</span> of{" "}
                          <span className="font-semibold">{bookings.length}</span> bookings
                        </p>
                      </div>
                      <AdminBookingList
                        bookings={filteredBookings}
                        onCancel={handleCancelBooking}
                        onConfirm={(id) => updateBookingStatus(id, "confirmed")}
                        onSetPending={(id) => updateBookingStatus(id, "pending")}
                        onDelete={deleteBooking}
                        loading={loading}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === "contacts" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Contact Messages</h2>
                    <div className="flex items-center gap-3">
                      <Filter className="w-5 h-5 text-gray-400" />
                      <select
                        value={contactFilter}
                        onChange={(e) => setContactFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Messages</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredContacts.length === 0 ? (
                      <div className="text-center py-12">
                        <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No messages found</p>
                      </div>
                    ) : (
                      filteredContacts.map((contact) => (
                        <ContactCard
                          key={contact.id}
                          contact={contact}
                          onMarkAsRead={markContactAsRead}
                          onDelete={deleteContact}
                          onTransferToBooking={handleTransferToBooking}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-500">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{bookingStats.total}</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-500">Total Messages</p>
                        <p className="text-2xl font-bold text-gray-900">{contactStats.total}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// StatusBadge component for the overview
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    confirmed: { color: "bg-green-100 text-green-800", label: "Confirmed" },
    cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default AdminDashboard;