// src/constants.js
export const ADMIN_EMAILS = import.meta.env.VITE_FIREBASE_ADMIN_EMAILS
  ? import.meta.env.VITE_FIREBASE_ADMIN_EMAILS.split(",").map(email => email.trim())
  : [];
