import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { Video, CreditCard, Shield, Plus } from "lucide-react";

// Import new modern components
import Navbar from "../components/landingpage/Navbar";
import HeroSection from "../components/landingpage/HeroSection";
import AboutSection from "../components/landingpage/AboutSection";
import ServicesSection from "../components/landingpage/ServiceSection";
import TeamSection from "../components/landingpage/TeamSection";
import GallerySection from "../components/landingpage/GallerySection";
import TestimonialsSection from "../components/landingpage/TestimonialsSection";
import CTASection from "../components/landingpage/CTASection";
import FAQSection from "../components/landingpage/FAQSection";
import ContactSection from "../components/landingpage/ContactSection";
import Footer from "../components/landingpage/Footer";
import BookingModal from "../components/landingpage/BookingModal";
import LoginModal from "../components/login/LoginModal";

// Dashboard Components
import DashboardHeader from "../components/dashboard/DashboardHeader";
import BookingForm from "../components/dashboard/booking/BookingForm";
import BookingList from "../components/dashboard/BookingList";
import ErrorAlert from "../components/common/ErrorAlert";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Import data from dentalData.js
import {
  dentalServices,
  ctaBenefits,
  teamMembers,
  galleryImages,
  testimonials,
  faqs,
  bookingServices,
} from "../components/landingpage/data/dentalData";

const DentalClinicWebsite = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: "",
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
      setShowLoginModal(false);
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid)
      );
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
      console.error("Error loading bookings:", err);
      setError("Failed to load bookings");
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
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
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

  const handleSignup = async () => {
    if (!loginEmail || !loginPassword) {
      setError("Please enter email and password");
      return;
    }

    if (loginPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
      setLoginEmail("");
      setLoginPassword("");
    } catch (err) {
      console.error("Signup error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use. Try logging in instead.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak");
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
      console.error("Logout error:", err);
      setError("Failed to logout");
    }
  };

  // UPDATED: Handle guest bookings without requiring login
  const handleBookingSubmit = (data) => {
    // Guest bookings are handled by the BookingModal component itself
    // This function is called after successful submission
    // Just close the modal - no need to process bookingData here
    console.log("Booking submitted:", data);
  };

  const handleDashboardBooking = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.date ||
      !formData.time
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const booking = {
        ...formData,
        userId: user.uid,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "bookings"), booking);
      await loadBookings();
      setShowBookingForm(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        date: "",
        time: "",
        notes: "",
      });
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    setLoading(true);
    setError("");

    try {
      await updateDoc(doc(db, "bookings", id), {
        status: "cancelled",
      });
      await loadBookings();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError("Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = (data) => {
    alert("Message sent successfully! We'll get back to you soon.");
    console.log("Contact data:", data);
  };

  if (initializing) {
    return <LoadingSpinner />;
  }

  // Landing Page - Show when not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar onSignIn={() => setShowLoginModal(true)} />

        <HeroSection
          onPrimaryClick={() => setShowBookingModal(true)}
          onSecondaryClick={() => setShowLoginModal(true)}
        />

        <AboutSection
          title="Why Choose Diego Dental"
          subtitle="We combine technology, care, and experience for your perfect smile"
          features={[
            {
              icon: Video,
              title: "Modern Equipment",
              description:
                "Experience advanced dental care with the latest technology for comfort and precision.",
              color: "blue",
            },
            {
              icon: CreditCard,
              title: "Affordable Pricing",
              description:
                "We believe everyone deserves quality dental care without breaking the bank.",
              color: "green",
            },
            {
              icon: Shield,
              title: "Trusted Experts",
              description:
                "Our skilled team ensures every visit is safe, comfortable, and professional.",
              color: "blue",
            },
          ]}
        />

        <ServicesSection
          services={dentalServices}
          onBookClick={() => setShowBookingModal(true)}
        />

        <TeamSection teamMembers={teamMembers} />

        <GallerySection
          images={galleryImages}
          onViewAll={() => alert("View full gallery")}
        />

        <TestimonialsSection testimonials={testimonials} />

        <CTASection
          variant="gradient"
          title="Everything You Need for Perfect Dental Care"
          subtitle="We make dental care accessible, affordable, and comfortable for everyone."
          benefits={ctaBenefits}
          buttonText="Get Started"
          onButtonClick={() => setShowBookingModal(true)}
        />

        <FAQSection faqs={faqs} />

        <CTASection
          variant="simple"
          title="Ready to transform your smile?"
          subtitle="Book your appointment today and experience the difference"
          buttonText="Schedule Your Visit"
          onButtonClick={() => setShowBookingModal(true)}
        />

        <ContactSection onSubmit={handleContactSubmit} />

        <Footer />

        {/* Booking Modal */}
        {showBookingModal && (
          <BookingModal
            onClose={() => setShowBookingModal(false)}
            onSuccess={handleBookingSubmit}
            services={bookingServices}
          />
        )}

        {/* Login Modal */}
        <LoginModal
          show={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            setError("");
          }}
          onLogin={handleLogin}
          onSignup={handleSignup}
          email={loginEmail}
          setEmail={setLoginEmail}
          password={loginPassword}
          setPassword={setLoginPassword}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  // Dashboard - Show when logged in
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Hide header when adding new booking */}
        {!showBookingForm && (
          <DashboardHeader user={user} onLogout={handleLogout} />
        )}

        <ErrorAlert message={error} />

        {/* Only show "+ New Booking" button if not in form view */}
        {!showBookingForm && (
          <button
            onClick={() => setShowBookingForm(true)}
            className="group relative w-full max-w-md mx-auto block overflow-hidden transition-all duration-500 mb-12"
          >
            <div className="relative px-8 py-4 bg-white border border-gray-200 rounded-2xl transition-all duration-500 group-hover:border-transparent group-hover:shadow-2xl group-hover:shadow-[#0056A3]/10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0056A3] to-[#009846] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative flex items-center justify-center gap-3">
                <Plus className="w-5 h-5 text-[#0056A3] group-hover:text-white transition-colors duration-500 group-hover:rotate-180" />
                <span className="text-sm font-semibold tracking-[0.2em] uppercase text-[#0056A3] group-hover:text-white transition-colors duration-500">
                  New Booking
                </span>
              </div>
            </div>
          </button>
        )}

        {/* Toggle between form and list */}
        {showBookingForm ? (
          <BookingForm
            formData={formData}
            onInputChange={(field, value) =>
              setFormData({ ...formData, [field]: value })
            }
            onSubmit={handleDashboardBooking}
            onCancel={() => setShowBookingForm(false)}
            loading={loading}
            db={db}
          />
        ) : (
          <BookingList
            bookings={bookings}
            onCancelBooking={cancelBooking}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default DentalClinicWebsite;
