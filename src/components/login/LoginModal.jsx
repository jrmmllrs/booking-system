import { useState } from "react";
import { XCircle } from "lucide-react";
import diegoLogo from "../../assets/transparent-logo.png";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function AuthModal({ show, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Registration fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!loginEmail || !loginPassword) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );

      // Success - call the callback with user data
      onAuthSuccess({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      });

      // Reset form
      setLoginEmail("");
      setLoginPassword("");
      onClose();
    } catch (err) {
      // Firebase error handling
      let errorMessage = "An error occurred during login";

      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later";
      } else if (err.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");

    if (
      !firstName ||
      !lastName ||
      !regEmail ||
      !regPassword ||
      !confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (regPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        regEmail,
        regPassword
      );

      // Save additional user info to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName,
        lastName,
        email: regEmail,
        createdAt: new Date().toISOString(),
      });

      // Success - call the callback
      onAuthSuccess({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        firstName,
        lastName,
      });

      // Reset form
      setFirstName("");
      setLastName("");
      setRegEmail("");
      setRegPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      // Firebase error handling
      let errorMessage = "An error occurred during registration";

      if (err.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleClose = () => {
    setError("");
    setLoginEmail("");
    setLoginPassword("");
    setFirstName("");
    setLastName("");
    setRegEmail("");
    setRegPassword("");
    setConfirmPassword("");
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <img
              src={diegoLogo}
              alt="Diego Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-600">
            {isLogin
              ? "Login to book your appointment"
              : "Sign up to start booking appointments"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Login Form */}
        {isLogin ? (
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="••••••••"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Signup Option */}
            <div className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <button
                onClick={switchMode}
                disabled={loading}
                className="text-cyan-600 font-semibold hover:text-cyan-700"
              >
                Sign up
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="John"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="••••••••"
                onKeyPress={(e) => e.key === "Enter" && handleRegister()}
              />
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login Option */}
            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <button
                onClick={switchMode}
                disabled={loading}
                className="text-cyan-600 font-semibold hover:text-cyan-700"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
