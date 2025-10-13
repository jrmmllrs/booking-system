// src/constants.js
export const ADMIN_EMAILS = import.meta.env.REACT_APP_ADMIN_EMAILS
  ? import.meta.env.REACT_APP_ADMIN_EMAILS.split(",")
  : [];
