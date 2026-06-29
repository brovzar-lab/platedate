import { useState, useMemo } from 'react';
import type { Restaurant } from '../types/restaurant';
import { useSwipeStore } from '../stores/swipeStore';

export function useRestaurantDeck(allRestaurants: Restaurant[]) {
  const [cuisineFilter, setCuisineFilter] = useState<string>('All');
  const getUnswipedForCurrentPartner = useSwipeStore(
    (s) => s.getUnswipedForCurrentPartner
  );

  const filtered = useMemo(() => {
    if (cuisineFilter === 'All') return allRestaurants;
    return allRestaurants.filter((r) => r.cuisine === cuisineFilter);
  }, [allRestaurants, cuisineFilter]);

  const deck = useMemo(
    () => getUnswipedForCurrentPartner(filtered),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtered, getUnswipedForCurrentPartner]
  );

  const cuisines = useMemo(() => {
    const all = Array.from(new Set(allRestaurants.map((r) => r.cuisine))).sort();
    return ['All', ...all];
  }, [allRestaurants]);

  return { deck, cuisines, cuisineFilter, setCuisineFilter };
}
