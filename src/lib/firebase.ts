// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import 'firebase/compat/auth';
import {getFirestore} from 'firebase/firestore';
import { getDatabase } from "firebase/database";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!
};



const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics only in browser environment
let analytics: any = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const db = getFirestore(app);
const rdb = getDatabase(app);  //realtime database
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// provider.setCustomParameters({ prompt: "select_account" });

export { auth, analytics, provider, db, rdb, app };
