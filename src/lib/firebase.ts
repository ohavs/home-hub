import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

let cachedApp: FirebaseApp | null = null;
let cachedDb: Firestore | null = null;

export const isFirebaseConfigured = (): boolean => !!(config.apiKey && config.projectId);

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!cachedApp) {
    cachedApp = getApps()[0] ?? initializeApp(config as Record<string, string>);
  }
  return cachedApp;
}

export function getDb(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!cachedDb) cachedDb = getFirestore(app);
  return cachedDb;
}
