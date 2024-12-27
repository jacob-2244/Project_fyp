import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB7aw8YXdRs_Ghv2chqVrRNCa8FgQXohHo",
  authDomain: "fyp-project-ef4aa.firebaseapp.com",
  projectId: "fyp-project-ef4aa",
  storageBucket: "fyp-project-ef4aa.appspot.com",
  messagingSenderId: "236067054007",
  appId: "1:236067054007:web:f4d6187ef3f0452e5b0832",
  measurementId: "G-1MPEG6TZ06"
};

// Ensure the app is initialized only once
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);