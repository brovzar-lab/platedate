import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { isDemoMode } from '../lib/demo';
import type { UserDoc } from '../types/user';

const DEMO_USER = {
  uid: 'demo-user',
  displayName: 'Demo User',
  email: 'demo@platedate.app',
} as User;

const DEMO_USER_DOC: UserDoc = {
  coupleId: 'demo-couple',
  role: 'partner1',
  displayName: 'Demo User',
  city: 'austin-tx',
};

interface AuthContextValue {
  currentUser: User | null;
  userDoc: UserDoc | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function ensureUserDoc(user: User): Promise<void> {
  if (!db) return;
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      coupleId: null,
      role: null,
      displayName: user.displayName || user.email || 'Anonymous',
      city: 'austin-tx',
      createdAt: serverTimestamp(),
    });
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(isDemoMode ? DEMO_USER : null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(isDemoMode ? DEMO_USER_DOC : null);
  const [loading, setLoading] = useState(!isDemoMode);

  useEffect(() => {
    if (isDemoMode || !auth || !db) return;

    let unsubDoc: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (unsubDoc) unsubDoc();

      if (!user) {
        setUserDoc(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db!, 'users', user.uid);
      unsubDoc = onSnapshot(userRef, (snap) => {
        setUserDoc(snap.exists() ? (snap.data() as UserDoc) : null);
        setLoading(false);
      });
    });

    return () => {
      unsubAuth();
      if (unsubDoc) unsubDoc();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await ensureUserDoc(result.user);
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) return;
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!auth) return;
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await ensureUserDoc(result.user);
  };

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    setUserDoc(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, userDoc, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
