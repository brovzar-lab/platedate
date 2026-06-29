import { useState, useMemo, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { isDemoMode } from '../lib/demo';
import { useAuth } from '../contexts/AuthContext';
import { useSwipeStore } from '../stores/swipeStore';
import type { Restaurant } from '../types/restaurant';

const TIER_ORDER: Record<string, number> = {
  sponsored: 0,
  partner: 1,
  listed: 2,
  claimed: 3,
  unclaimed: 4,
};

export function useRestaurantDeck(demoRestaurants: Restaurant[]) {
  const [cuisineFilter, setCuisineFilter] = useState<string>('All');

  // Demo mode
  const getUnswipedForCurrentPartner = useSwipeStore(
    (s) => s.getUnswipedForCurrentPartner
  );

  // Real mode
  const { userDoc } = useAuth();
  const [firestoreRestaurants, setFirestoreRestaurants] = useState<Restaurant[]>([]);
  const [swipedIds, setSwipedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(!isDemoMode);

  const coupleId = userDoc?.coupleId;
  const role = userDoc?.role;
  const city = userDoc?.city ?? 'austin-tx';

  useEffect(() => {
    if (isDemoMode || !db || !coupleId || !role) return;

    const userField = role === 'partner1' ? 'user1Decision' : 'user2Decision';

    // One-time fetch of restaurant deck
    const q = query(collection(db, 'restaurants'), where('city', '==', city));
    getDocs(q).then((snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Restaurant));
      data.sort(
        (a, b) => (TIER_ORDER[a.tier] ?? 99) - (TIER_ORDER[b.tier] ?? 99)
      );
      setFirestoreRestaurants(data);
      setLoading(false);
    });

    // Live subscription to current user's swipe decisions
    const swipesRef = collection(db, 'couples', coupleId, 'swipes');
    const unsubscribe = onSnapshot(swipesRef, (snap) => {
      const swiped = new Set<string>();
      snap.docs.forEach((d) => {
        const data = d.data();
        if (data[userField] !== null && data[userField] !== undefined) {
          swiped.add(d.id);
        }
      });
      setSwipedIds(swiped);
    });

    return () => unsubscribe();
  }, [coupleId, role, city]);

  const allRestaurants = isDemoMode ? demoRestaurants : firestoreRestaurants;

  const filtered = useMemo(() => {
    const base =
      cuisineFilter === 'All'
        ? allRestaurants
        : allRestaurants.filter((r) => r.cuisine === cuisineFilter);

    if (isDemoMode) return base;
    return base.filter((r) => !swipedIds.has(r.id));
  }, [allRestaurants, cuisineFilter, swipedIds]);

  const deck = useMemo(() => {
    if (isDemoMode) return getUnswipedForCurrentPartner(filtered);
    return filtered;
  }, [filtered, getUnswipedForCurrentPartner]);

  const cuisines = useMemo(() => {
    const all = Array.from(new Set(allRestaurants.map((r) => r.cuisine))).sort();
    return ['All', ...all];
  }, [allRestaurants]);

  return { deck, cuisines, cuisineFilter, setCuisineFilter, loading, allRestaurants };
}
