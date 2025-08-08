// config/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeFirestore,
  getFirestore,
  setLogLevel,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqFJmRzC0BBOg7UMxKp4I8q4u_bl-KUf4",
  authDomain: "eventorganizerapp-1d2f7.firebaseapp.com",
  projectId: "eventorganizerapp-1d2f7",
  storageBucket: "eventorganizerapp-1d2f7.appspot.com",
  messagingSenderId: "144361303913",
  appId: "1:144361303913:web:32d8227fe7cb67549d57f8",
};

// Ensure a single app instance (survives Fast Refresh)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// --- Auth: initialize once, else reuse existing ---
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // If already initialized, just get the existing instance
  auth = getAuth(app);
}

// --- Firestore: initialize once with RN-friendly transport ---
let db;
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
  });
} catch (e) {
  db = getFirestore(app);
}

// Optional while debugging; switch to "warn" or remove for production
setLogLevel("warn");

export { app, auth, db };
