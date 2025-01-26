// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Correct import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz5KrgvMFCZPXZAhZnI6Ck_sD6F_gCZ2I",
  authDomain: "busness-5120a.firebaseapp.com",
  projectId: "busness-5120a",
  storageBucket: "busness-5120a.appspot.com",
  messagingSenderId: "453561103920",
  appId: "1:453561103920:web:e1e24a2d82cdda0da55ff5",
  measurementId: "G-K06L07H46R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app); // Correct initialization