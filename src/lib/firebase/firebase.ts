import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:demo",
};

// Check if Firebase is properly configured
const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (isFirebaseConfigured) {
    try {
        app = getApps().length ? getApp() : initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
    } catch (error) {
        console.warn("Firebase initialization failed:", error);
    }
}

export { app, auth, db, storage, isFirebaseConfigured };
