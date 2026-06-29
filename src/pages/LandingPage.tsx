import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isDemoMode } from '../lib/demo';

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm text-center"
      >
        <div className="mb-6 text-6xl">🍽️</div>
        <h1 className="text-4xl font-black text-slate-900">PlateDate</h1>
        <p className="mt-2 text-xl font-medium text-rose-500">Swipe right together.</p>
        <p className="mt-4 text-slate-500 leading-relaxed">
          Stop debating "where do you want to eat?" Swipe on restaurants together with your partner
          and get matched on places you both love.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {isDemoMode && (
            <Link
              to="/swipe"
              className="rounded-2xl bg-rose-500 px-6 py-4 text-center text-lg font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-600 hover:shadow-rose-300 active:scale-95"
            >
              Try Demo 🎯
            </Link>
          )}
          <Link
            to="/auth"
            className="rounded-2xl bg-white px-6 py-4 text-center text-lg font-semibold text-slate-700 shadow-md transition-all hover:bg-slate-50 active:scale-95"
          >
            Create a Couple
          </Link>
          <Link
            to="/join"
            className="rounded-2xl border-2 border-slate-200 bg-transparent px-6 py-4 text-center text-lg font-semibold text-slate-600 transition-all hover:border-rose-300 hover:text-rose-500 active:scale-95"
          >
            Join a Couple
          </Link>
        </div>

        {isDemoMode && (
          <p className="mt-6 text-xs text-slate-400">
            Demo mode active — no account needed to explore
          </p>
        )}
      </motion.div>
    </div>
  );
}
