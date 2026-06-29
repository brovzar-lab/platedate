import { useMemo } from 'react';
import type { Restaurant } from '../types/restaurant';
import { useSwipeStore } from '../stores/swipeStore';

export function useMatches(allRestaurants: Restaurant[]) {
  const matchIds = useSwipeStore((s) => s.matches);

  const matchedRestaurants = useMemo(
    () => allRestaurants.filter((r) => matchIds.includes(r.id)),
    [allRestaurants, matchIds]
  );

  return matchedRestaurants;
}
