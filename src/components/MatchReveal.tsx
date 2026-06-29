import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Restaurant } from '../types/restaurant';
import { isDemoMode } from '../lib/demo';

interface MatchRevealProps {
  restaurant: Restaurant;
  onDismiss: () => void;
}

export function MatchReveal({ restaurant, onDismiss }: MatchRevealProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    onDismiss();
    navigate(`/restaurant/${restaurant.id}`);
  };

  const handleDirections = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`,
      '_blank'
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          <div className="relative aspect-video">
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-6xl"
              >
                🎉
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-2 text-2xl font-black text-white"
              >
                It's a Match!
              </motion.p>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900">{restaurant.name}</h2>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600">
                {restaurant.cuisine}
              </span>
              <span>{restaurant.priceRange}</span>
            </div>
            <p className="mt-1 text-sm text-slate-400">{restaurant.address}</p>

            {isDemoMode && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Demo mode — not saved
              </p>
            )}

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handleDirections}
                className="w-full rounded-xl bg-rose-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-rose-600"
              >
                Get Directions
              </button>
              <button
                onClick={handleViewDetails}
                className="w-full rounded-xl bg-slate-100 px-4 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-200"
              >
                View Details
              </button>
              <button
                onClick={onDismiss}
                className="w-full px-4 py-2 text-sm text-slate-400 transition-colors hover:text-slate-600"
              >
                Keep Swiping
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
