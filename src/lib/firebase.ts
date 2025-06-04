import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  // Replace with your actual Firebase API key from project settings
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 
  authDomain: "studio-2g0b5.firebaseapp.com",
  projectId: "studio-2g0b5",
  storageBucket: "studio-2g0b5.firebasestorage.app",
  messagingSenderId: "720305803042",
  appId: "1:720305803042:web:d7611285542b9f6668df7b"
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

let auth: Auth;
// Check if the app is initialized before getting auth
if (app) {
  auth = getAuth(app);
}

const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
