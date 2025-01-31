import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

// Google Sign-In
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google sign-in failed:", error);
    throw error;
  }
};

export { auth, db, signInWithGoogle };