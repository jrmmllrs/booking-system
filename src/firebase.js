// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBAbZGGA4umqdUXextUC-dX_GZ6YPLe3fg",
  authDomain: "homeserbase.firebaseapp.com",
  projectId: "homeserbase",
  storageBucket: "homeserbase.firebasestorage.app",
  messagingSenderId: "570650478517",
  appId: "1:570650478517:web:d6f5d30835d142cec6fbfc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;