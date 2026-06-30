import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigValid = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.length > 0
);

let app: FirebaseApp | undefined = undefined;
if (isFirebaseConfigValid) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
} else if (getApps().length > 0) {
  app = getApps()[0];
} else {
  console.warn('Firebase config is not fully configured. Firestore and Auth are disabled.');
}

const auth = app ? getAuth(app) : null;

// Database ID is "default" (without parentheses), not the standard "(default)"
const db = app ? getFirestore(app, 'default') : (null as unknown as Firestore);

export { app, auth, db, isFirebaseConfigValid };
