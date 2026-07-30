import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // <-- Add this

const firebaseConfig = {
  apiKey: "AIzaSyD_FrYxMZO2ICN0aAswNxKXthmZO_yQd6c",
  authDomain: "veritaz-bbaf5.firebaseapp.com",
  projectId: "veritaz-bbaf5",
  storageBucket: "veritaz-bbaf5.firebasestorage.app",
  messagingSenderId: "556585946340",
  appId: "1:556585946340:web:d569fa757126263063f0f1",
  measurementId: "G-PV7C87QKNQ",
};

const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

// Authentication
export const auth = getAuth(app); // <-- Add this

// Analytics
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;