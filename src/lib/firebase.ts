import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { isDemoMode } from './demo';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAGMObLPn_t-0XlkPIjhQi2frBfh71NB6U',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'lemon-es-tu-dios.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'lemon-es-tu-dios',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'lemon-es-tu-dios.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '477175602236',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:477175602236:web:b2e1276dc84daa9830b739',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (!isDemoMode) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
