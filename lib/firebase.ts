import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDBB7ps0l3Pelav5tFSh6c_vjeSCdqlrBQ',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'hyderabad-startups.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'hyderabad-startups',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'hyderabad-startups.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1033143870354',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1033143870354:web:8a21b4990661c08bbe174b',
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
