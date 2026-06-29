import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMatches } from '../hooks/useMatches';
import { RestaurantCard } from '../components/RestaurantCard';
import restaurants from '../data/austinRestaurants.json';
import type { Restaurant } from '../types/restaurant';

const allRestaurants = restaurants as Restaurant[];

export function MatchedListPage() {
  const matchedRestaurants = useMatches(allRestaurants);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <header className="flex items-center gap-4 px-4 py-4">
        <Link to="/swipe" className="text-slate-400 hover:text-slate-600">
          ←
        </Link>
        <h1 className="text-xl font-black text-slate-900">Your Matches</h1>
        <span className="ml-auto rounded-full bg-rose-100 px-2.5 py-0.5 text-sm font-semibold text-rose-600">
          {matchedRestaurants.length}
        </span>
      </header>

      <div className="px-4 pb-8">
        {matchedRestaurants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 py-20 text-center"
          >
            <div className="text-6xl">🤔</div>
            <h3 className="text-xl font-bold text-slate-700">No matches yet</h3>
            <p className="text-slate-500 leading-relaxed">
              Both partners need to swipe right on the same restaurant for a match to appear here.
            </p>
            <Link
              to="/swipe"
              className="mt-2 rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
            >
              Start Swiping →
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {matchedRestaurants.map((restaurant, i) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
