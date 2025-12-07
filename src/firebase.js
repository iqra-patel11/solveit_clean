// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCyPJtlxhEfiM_CairJn9fUOmeUk8foNcQ",
  authDomain: "solveit-clean.firebaseapp.com",
  projectId: "solveit-clean",
  storageBucket: "solveit-clean.firebasestorage.app",
  messagingSenderId: "1033010078148",
  appId: "1:1033010078148:web:9f65bfbb08143ce7b80491",
  measurementId: "G-84994F334E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 👉 These exports are required by the rest of your app:
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
