import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { isDemoMode } from '../lib/demo';

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function CoupleSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isJoin = location.pathname === '/join';
  const { currentUser, userDoc } = useAuth();

  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [creating, setCreating] = useState(false);

  const [inputCode, setInputCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    if (!isDemoMode && userDoc?.coupleId) {
      navigate('/swipe', { replace: true });
    }
  }, [userDoc, navigate]);

  // Listen for partner joining after couple is created
  useEffect(() => {
    if (isDemoMode || !coupleId || !db) return;
    const coupleRef = doc(db, 'couples', coupleId);
    const unsub = onSnapshot(coupleRef, (snap) => {
      if (snap.exists() && snap.data().user2Id) {
        navigate('/swipe', { replace: true });
      }
    });
    return unsub;
  }, [coupleId, navigate]);

  const handleCreate = async () => {
    if (isDemoMode || !currentUser || !db) {
      navigate('/swipe');
      return;
    }
    setCreating(true);
    try {
      const code = generateCode();
      const coupleRef = doc(collection(db, 'couples'));
      await setDoc(coupleRef, {
        user1Id: currentUser.uid,
        user2Id: null,
        joinCode: code,
        city: 'austin-tx',
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'users', currentUser.uid), {
        coupleId: coupleRef.id,
        role: 'partner1',
      });
      setCoupleId(coupleRef.id);
      setJoinCode(code);
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async () => {
    if (isDemoMode) {
      navigate('/swipe');
      return;
    }
    if (!inputCode || !currentUser || !db) return;
    setJoining(true);
    setJoinError('');
    try {
      const q = query(
        collection(db, 'couples'),
        where('joinCode', '==', inputCode.toUpperCase()),
        where('user2Id', '==', null)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setJoinError('Code not found or already used. Ask your partner to check.');
        return;
      }
      const coupleDoc = snap.docs[0];
      await updateDoc(coupleDoc.ref, { user2Id: currentUser.uid });
      await updateDoc(doc(db, 'users', currentUser.uid), {
        coupleId: coupleDoc.id,
        role: 'partner2',
      });
      navigate('/swipe', { replace: true });
    } finally {
      setJoining(false);
    }
  };

  const displayCode = isDemoMode ? 'DEMO42' : joinCode;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-600">
          ← Back
        </Link>

        {isJoin ? (
          <>
            <h2 className="text-2xl font-black text-slate-900">Join a Couple</h2>
            <p className="mt-1 text-slate-500">Enter the code your partner shared with you.</p>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">Join Code</label>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="e.g. DEMO42"
                maxLength={6}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-2xl font-mono font-bold tracking-[0.3em] text-slate-900 outline-none transition-colors focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>

            {joinError && <p className="mt-2 text-sm text-red-500">{joinError}</p>}

            <button
              onClick={handleJoin}
              disabled={joining || (!isDemoMode && inputCode.length < 6)}
              className="mt-4 w-full rounded-2xl bg-rose-500 px-6 py-4 text-center text-lg font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {joining ? 'Joining...' : 'Join & Start Swiping'}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-black text-slate-900">Create a Couple</h2>
            <p className="mt-1 text-slate-500">Share this code with your partner to start swiping together.</p>

            {!coupleId && !isDemoMode ? (
              <button
                onClick={handleCreate}
                disabled={creating}
                className="mt-6 w-full rounded-2xl bg-rose-500 px-6 py-4 text-center text-lg font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-600 active:scale-95 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Couple & Get Code'}
              </button>
            ) : (
              <>
                <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow-md">
                  <p className="text-sm font-medium text-slate-500">Your Join Code</p>
                  <p className="mt-2 text-5xl font-black tracking-[0.2em] text-slate-900">{displayCode}</p>
                  <p className="mt-2 text-xs text-slate-400">Share this with your partner</p>
                </div>

                <p className="mt-3 text-center text-sm text-slate-400">
                  {isDemoMode ? 'Demo mode' : 'Waiting for your partner to join...'}
                </p>

                <button
                  onClick={() => navigate('/swipe')}
                  className="mt-4 w-full rounded-2xl bg-rose-500 px-6 py-4 text-center text-lg font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-600 active:scale-95"
                >
                  Start Swiping →
                </button>

                <Link
                  to="/join"
                  className="mt-3 block text-center text-sm text-slate-400 hover:text-rose-500"
                >
                  Have a code? Join instead
                </Link>
              </>
            )}

            {!coupleId && !isDemoMode && (
              <Link
                to="/join"
                className="mt-3 block text-center text-sm text-slate-400 hover:text-rose-500"
              >
                Have a code? Join instead
              </Link>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
