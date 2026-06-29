import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSwipeStore } from '../stores/swipeStore';
import { useRestaurantDeck } from '../hooks/useRestaurantDeck';
import { SwipeCard } from '../components/SwipeCard';
import { CuisineFilter } from '../components/CuisineFilter';
import { DemoBanner } from '../components/DemoBanner';
import { MatchReveal } from '../components/MatchReveal';
import { isDemoMode } from '../lib/demo';
import restaurants from '../data/austinRestaurants.json';
import type { Restaurant } from '../types/restaurant';

const allRestaurants = restaurants as Restaurant[];

export function SwipeDeckPage() {
  const { currentPartnerId, swipe, togglePartner, pendingMatch, matches } = useSwipeStore();
  const { deck, cuisines, cuisineFilter, setCuisineFilter } = useRestaurantDeck(allRestaurants);
  const [swipingId, setSwipingId] = useState<string | null>(null);

  const pendingRestaurant = pendingMatch
    ? allRestaurants.find((r) => r.id === pendingMatch)
    : null;

  const handleSwipe = useCallback(
    (restaurantId: string, decision: 'yes' | 'no') => {
      setSwipingId(restaurantId);
      swipe(restaurantId, decision);
      setTimeout(() => setSwipingId(null), 300);
    },
    [swipe]
  );

  const topCards = deck.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <header className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-2xl font-black text-slate-900">
          🍽️ PlateDate
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/matches"
            className="relative rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-rose-50 hover:text-rose-600"
          >
            Matches
            {matches.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {matches.length}
              </span>
            )}
          </Link>
          <button
            onClick={togglePartner}
            className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-slate-50"
          >
            <span
              className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                currentPartnerId === 'partner1'
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-400'
              }`}
            >
              P1
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                currentPartnerId === 'partner2'
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-400'
              }`}
            >
              P2
            </span>
          </button>
        </div>
      </header>

      <div className="px-4 py-2">
        {isDemoMode && <DemoBanner />}
      </div>

      <div className="px-4 py-2">
        <CuisineFilter
          cuisines={cuisines}
          selected={cuisineFilter}
          onSelect={setCuisineFilter}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-4">
        {topCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="text-6xl">🎊</div>
            <h3 className="text-xl font-bold text-slate-700">You've seen them all!</h3>
            <p className="text-slate-500">
              {cuisineFilter !== 'All'
                ? `No more ${cuisineFilter} spots. Try a different cuisine.`
                : 'Check your matches or wait for new restaurants.'}
            </p>
            <Link
              to="/matches"
              className="rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
            >
              View Matches →
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="relative h-[420px] w-full max-w-sm">
              <AnimatePresence>
                {topCards.map((restaurant, index) => (
                  <motion.div
                    key={restaurant.id}
                    className="absolute inset-0"
                    animate={{
                      opacity: swipingId === restaurant.id ? 0 : 1,
                      x: swipingId === restaurant.id ? 300 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <SwipeCard
                      restaurant={restaurant}
                      onSwipe={(decision) => handleSwipe(restaurant.id, decision)}
                      isTop={index === 0}
                      stackIndex={index}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center gap-6">
              <button
                onClick={() => handleSwipe(topCards[0].id, 'no')}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95"
              >
                <span className="text-2xl">✗</span>
              </button>
              <div className="text-center">
                <p className="text-xs font-medium text-slate-400">
                  {deck.length} left for {currentPartnerId === 'partner1' ? 'Partner 1' : 'Partner 2'}
                </p>
              </div>
              <button
                onClick={() => handleSwipe(topCards[0].id, 'yes')}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 shadow-lg shadow-rose-200 transition-all hover:scale-110 hover:bg-rose-600 hover:shadow-xl active:scale-95"
              >
                <span className="text-2xl">♥</span>
              </button>
            </div>
          </>
        )}
      </div>

      {pendingRestaurant && <MatchReveal restaurant={pendingRestaurant} />}
    </div>
  );
}
