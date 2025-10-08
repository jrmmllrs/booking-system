import { XCircle, Heart } from "lucide-react";

export default function LoginModal({
  show,
  onClose,
  onLogin,
  onSignup, // This now switches to signup modal
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">Login to book your appointment</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="••••••••"
              onKeyPress={(e) => e.key === "Enter" && onLogin()}
            />
          </div>

          {/* Login Button */}
          <button
            onClick={onLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Signup Option */}
          <div className="text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <button
              onClick={onSignup}
              disabled={loading}
              className="text-cyan-600 font-semibold hover:text-cyan-700"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}