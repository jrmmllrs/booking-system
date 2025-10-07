// src/components/ErrorAlert.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorAlert = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
      <p className="text-sm text-red-600">{message}</p>
    </div>
  );
};

export default ErrorAlert;