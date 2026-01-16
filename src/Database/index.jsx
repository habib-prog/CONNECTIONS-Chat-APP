// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "connections-8b90e.firebaseapp.com",
  projectId: "connections-8b90e",
  storageBucket: "connections-8b90e.appspot.com",
  messagingSenderId: "160773847165",
  appId: "1:160773847165:web:7bfb1fd9719dd84f58d914",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
