import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDTLn9GMpRZB6Xz1jS_VEpqR1ZBvxFSAGE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "shop-savvy-inventory-hub.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "shop-savvy-inventory-hub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "shop-savvy-inventory-hub.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "598954150628",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:598954150628:web:1e36e5cbcc9aebbde72a60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app; 