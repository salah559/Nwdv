import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrSFfFI8m_-d9DTRSwZ2o1z1H3Wz7_CXE",
  authDomain: "nvwd-1c007.firebaseapp.com",
  projectId: "nvwd-1c007",
  storageBucket: "nvwd-1c007.firebasestorage.app",
  messagingSenderId: "792624205037",
  appId: "1:792624205037:web:3902f4972d97983f03d0e4",
  measurementId: "G-GDLMY3NYBK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { app, db, analytics };
