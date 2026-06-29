import { useState, useEffect, useMemo, useRef } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { isDemoMode } from '../lib/demo';
import { useAuth } from '../contexts/AuthContext';
import { useSwipeStore } from '../stores/swipeStore';
import type { Restaurant } from '../types/restaurant';

export function useMatches(demoRestaurants: Restaurant[]) {
  const { userDoc } = useAuth();

  // Demo mode state (from Zustand store)
  const storePendingMatch = useSwipeStore((s) => s.pendingMatch);
  const storeDismissMatch = useSwipeStore((s) => s.dismissMatch);
  const storeMatches = useSwipeStore((s) => s.matches);

  // Real mode state
  const [firestoreMatched, setFirestoreMatched] = useState<Restaurant[]>([]);
  const [pendingMatchRestaurant, setPendingMatchRestaurant] = useState<Restaurant | null>(null);
  const isFirstSnapshot = useRef(true);

  const coupleId = userDoc?.coupleId;

  useEffect(() => {
    if (isDemoMode || !db || !coupleId) return;

    isFirstSnapshot.current = true;

    const q = query(
      collection(db, 'couples', coupleId, 'swipes'),
      where('matchedAt', '!=', null)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const matchIds = snapshot.docs.map((d) => d.id);

      // Detect newly added matches (skip initial load to avoid spurious reveals)
      if (!isFirstSnapshot.current) {
        const newIds = snapshot
          .docChanges()
          .filter((c) => c.type === 'added')
          .map((c) => c.doc.id);

        if (newIds.length > 0 && db) {
          const latestId = newIds[newIds.length - 1];
          const snap = await getDoc(doc(db, 'restaurants', latestId));
          if (snap.exists()) {
            setPendingMatchRestaurant({ id: snap.id, ...snap.data() } as Restaurant);
          }
        }
      }
      isFirstSnapshot.current = false;

      // Fetch full restaurant objects for all matches
      if (!db) return;
      const restaurants: Restaurant[] = [];
      await Promise.all(
        matchIds.map(async (id) => {
          const snap = await getDoc(doc(db!, 'restaurants', id));
          if (snap.exists()) {
            restaurants.push({ id: snap.id, ...snap.data() } as Restaurant);
          }
        })
      );
      setFirestoreMatched(restaurants);
    });

    return () => {
      unsubscribe();
      isFirstSnapshot.current = true;
    };
  }, [coupleId]);

  const demoPendingMatch = useMemo(
    () =>
      isDemoMode && storePendingMatch
        ? (demoRestaurants.find((r) => r.id === storePendingMatch) ?? null)
        : null,
    [demoRestaurants, storePendingMatch]
  );

  const demoMatchedRestaurants = useMemo(
    () =>
      isDemoMode ? demoRestaurants.filter((r) => storeMatches.includes(r.id)) : [],
    [demoRestaurants, storeMatches]
  );

  const dismissMatch = () => {
    if (isDemoMode) {
      storeDismissMatch();
    } else {
      setPendingMatchRestaurant(null);
    }
  };

  return {
    matchedRestaurants: isDemoMode ? demoMatchedRestaurants : firestoreMatched,
    pendingMatch: isDemoMode ? demoPendingMatch : pendingMatchRestaurant,
    dismissMatch,
  };
}
