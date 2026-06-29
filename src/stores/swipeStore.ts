import { create } from 'zustand';
import type { Restaurant } from '../types/restaurant';
import type { PartnerId } from '../types/couple';

interface SwipeDecision {
  partner1: 'yes' | 'no' | null;
  partner2: 'yes' | 'no' | null;
}

interface SwipeStore {
  currentPartnerId: PartnerId;
  swipes: Record<string, SwipeDecision>;
  matches: string[];
  pendingMatch: string | null;
  swipe: (restaurantId: string, decision: 'yes' | 'no') => void;
  togglePartner: () => void;
  dismissMatch: () => void;
  getUnswipedForCurrentPartner: (restaurants: Restaurant[]) => Restaurant[];
  reset: () => void;
}

export const useSwipeStore = create<SwipeStore>((set, get) => ({
  currentPartnerId: 'partner1',
  swipes: {},
  matches: [],
  pendingMatch: null,

  swipe: (restaurantId, decision) => {
    const { currentPartnerId, swipes, matches } = get();
    const existing = swipes[restaurantId] ?? { partner1: null, partner2: null };
    const updated: SwipeDecision = {
      ...existing,
      [currentPartnerId]: decision,
    };

    const isNewMatch =
      decision === 'yes' &&
      updated.partner1 === 'yes' &&
      updated.partner2 === 'yes' &&
      !matches.includes(restaurantId);

    set((state) => ({
      swipes: { ...state.swipes, [restaurantId]: updated },
      matches: isNewMatch ? [...state.matches, restaurantId] : state.matches,
      pendingMatch: isNewMatch ? restaurantId : state.pendingMatch,
    }));
  },

  togglePartner: () =>
    set((state) => ({
      currentPartnerId:
        state.currentPartnerId === 'partner1' ? 'partner2' : 'partner1',
    })),

  dismissMatch: () => set({ pendingMatch: null }),

  getUnswipedForCurrentPartner: (restaurants) => {
    const { currentPartnerId, swipes } = get();
    return restaurants.filter((r) => {
      const decision = swipes[r.id];
      if (!decision) return true;
      return decision[currentPartnerId] === null;
    });
  },

  reset: () =>
    set({ swipes: {}, matches: [], pendingMatch: null, currentPartnerId: 'partner1' }),
}));
