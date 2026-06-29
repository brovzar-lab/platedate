import { useCallback } from 'react';
import {
  doc,
  runTransaction,
  serverTimestamp,
  increment,
  FieldValue,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { isDemoMode } from '../lib/demo';
import { useAuth } from '../contexts/AuthContext';
import { useSwipeStore } from '../stores/swipeStore';

export function useSwipe() {
  const { userDoc } = useAuth();
  const storageSwipe = useSwipeStore((s) => s.swipe);

  const recordSwipe = useCallback(
    async (restaurantId: string, decision: 'yes' | 'no') => {
      if (isDemoMode || !db || !userDoc?.coupleId || !userDoc?.role) {
        storageSwipe(restaurantId, decision);
        return;
      }

      const { coupleId, role } = userDoc;
      const field = role === 'partner1' ? 'user1Decision' : 'user2Decision';
      const swipeRef = doc(db, 'couples', coupleId, 'swipes', restaurantId);
      const restaurantRef = doc(db, 'restaurants', restaurantId);

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(swipeRef);
        const existing = snap.exists()
          ? snap.data()
          : { user1Decision: null, user2Decision: null, matchedAt: null };

        const updated = { ...existing, [field]: decision };
        const isMatch =
          updated.user1Decision === 'yes' &&
          updated.user2Decision === 'yes' &&
          !existing.matchedAt;

        if (isMatch) {
          updated.matchedAt = serverTimestamp();
        }

        tx.set(swipeRef, updated);

        const statsUpdate: Record<string, FieldValue> = {
          'stats.impressions': increment(1),
        };
        if (decision === 'yes') statsUpdate['stats.swipeRights'] = increment(1);
        if (isMatch) statsUpdate['stats.matches'] = increment(1);
        tx.update(restaurantRef, statsUpdate);
      });
    },
    [userDoc, storageSwipe]
  );

  return { recordSwipe };
}
