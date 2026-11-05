// src/firebase/init.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { firebaseConfig } from "./config";

// Inisialisasi aplikasi Firebase
const app = initializeApp(firebaseConfig);

// Export layanan utama
export const db = getFirestore(app);
export const auth = getAuth(app);

// Helper Auth Admin
export const loginAdmin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutAdmin = () => {
  return signOut(auth);
};

export { onAuthStateChanged };
