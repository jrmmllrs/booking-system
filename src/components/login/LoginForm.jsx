// src/components/LoginForm.jsx
import React from "react";
import { Calendar, User } from "lucide-react";
import ErrorAlert from "../common/ErrorAlert";

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  onLogin,
  onSignup,
  loading,
  error,
  isAdmin = false,
}) => {
  const Icon = isAdmin ? User : Calendar;
  const bgGradient = isAdmin
    ? "from-purple-50 to-pink-100"
    : "from-blue-50 to-indigo-100";
  const iconBg = isAdmin ? "bg-purple-100" : "bg-indigo-100";
  const iconColor = isAdmin ? "text-purple-600" : "text-indigo-600";
  const buttonBg = isAdmin
    ? "bg-purple-600 hover:bg-purple-700"
    : "bg-indigo-600 hover:bg-indigo-700";
  const title = isAdmin ? "Admin Dashboard" : "Booking System";
  const subtitle = isAdmin
    ? "Sign in with admin credentials"
    : "Sign in to manage your appointments";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} flex items-center justify-center p-4`}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 ${iconBg} rounded-full mb-4`}
          >
            <Icon className={`w-8 h-8 ${iconColor}`} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>

        <ErrorAlert message={error} />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onLogin()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={isAdmin ? "admin@example.com" : "Enter your email"}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onLogin()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {isAdmin ? (
            <button
              onClick={onLogin}
              disabled={loading}
              className={`w-full ${buttonBg} text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={onLogin}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Sign In"}
              </button>
              <button
                onClick={onSignup}
                disabled={loading}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {!isAdmin && (
          <p className="text-xs text-gray-500 text-center mt-6">
            New user? Click Sign Up to create an account
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
