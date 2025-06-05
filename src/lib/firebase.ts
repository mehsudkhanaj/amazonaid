
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;

if (!getApps().length) {
  if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId ||
    !firebaseConfig.storageBucket ||
    !firebaseConfig.messagingSenderId ||
    !firebaseConfig.appId
  ) {
    console.error(
      "Firebase configuration is missing one or more required fields. " +
      "Please check your .env file and ensure all NEXT_PUBLIC_FIREBASE_ variables are set."
    );
    // Set app to a placeholder or handle the error appropriately to prevent further execution
    // For now, we'll let it proceed, but Firebase operations will likely fail.
    // It's better to ensure env vars are set.
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

let auth: Auth;
if (app && firebaseConfig.apiKey) { // Also check if apiKey is present, as it's crucial for auth
  auth = getAuth(app);
} else {
  console.error(
    "Firebase app is not initialized or API key is missing. Auth service cannot be loaded."
  );
  // @ts-ignore - auth will be undefined, consuming code should handle this
  auth = undefined;
}

// Ensure app is defined before trying to use it for Firestore and Storage
const db: Firestore = app && firebaseConfig.projectId ? getFirestore(app) : undefined as unknown as Firestore;
const storage: FirebaseStorage = app && firebaseConfig.storageBucket ? getStorage(app) : undefined as unknown as FirebaseStorage;

export { app, auth, db, storage };
