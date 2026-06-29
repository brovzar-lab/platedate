import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export function CoupleSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isJoin = location.pathname === '/join';
  const [code, setCode] = useState('');

  const fakeJoinCode = 'DEMO42';

  const handleCreate = () => {
    navigate('/swipe');
  };

  const handleJoin = () => {
    navigate('/swipe');
  };

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
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. DEMO42"
                maxLength={6}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-2xl font-mono font-bold tracking-[0.3em] text-slate-900 outline-none transition-colors focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>

            <button
              onClick={handleJoin}
              className="mt-4 w-full rounded-2xl bg-rose-500 px-6 py-4 text-center text-lg font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-600 active:scale-95"
            >
              Join & Start Swiping
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-black text-slate-900">Create a Couple</h2>
            <p className="mt-1 text-slate-500">Share this code with your partner to start swiping together.</p>

            <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow-md">
              <p className="text-sm font-medium text-slate-500">Your Join Code</p>
              <p className="mt-2 text-5xl font-black tracking-[0.2em] text-slate-900">{fakeJoinCode}</p>
              <p className="mt-2 text-xs text-slate-400">Valid for 24 hours</p>
            </div>

            <button
              onClick={handleCreate}
              className="mt-4 w-full rounded-2xl bg-rose-500 px-6 py-4 text-center text-lg font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-600 active:scale-95"
            >
              Start Swiping Solo →
            </button>

            <Link
              to="/join"
              className="mt-3 block text-center text-sm text-slate-400 hover:text-rose-500"
            >
              Have a code? Join instead
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
