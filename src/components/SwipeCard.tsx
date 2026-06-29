import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import type { Restaurant } from '../types/restaurant';

interface SwipeCardProps {
  restaurant: Restaurant;
  onSwipe: (decision: 'yes' | 'no') => void;
  isTop: boolean;
  stackIndex: number;
}

const SWIPE_THRESHOLD = 80;

export function SwipeCard({ restaurant, onSwipe, isTop, stackIndex }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20]);
  const yesOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const noOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (!isTop) return;
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe('yes');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe('no');
    }
  };

  const scale = 1 - stackIndex * 0.04;
  const yOffset = stackIndex * 10;

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        scale,
        y: yOffset,
        zIndex: 10 - stackIndex,
      }}
    >
      <motion.div
        drag={isTop ? 'x' : false}
        dragConstraints={{ left: -300, right: 300 }}
        onDragEnd={handleDragEnd}
        style={{ x, rotate }}
        className="relative h-full w-full cursor-grab select-none overflow-hidden rounded-3xl shadow-xl active:cursor-grabbing"
        whileTap={{ cursor: 'grabbing' }}
      >
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="h-full w-full object-cover"
          draggable={false}
        />

        <motion.div
          className="absolute inset-0 flex items-center justify-center rounded-3xl border-4 border-green-400 bg-green-400/10"
          style={{ opacity: yesOpacity }}
        >
          <span className="rotate-[-20deg] rounded-xl border-4 border-green-400 px-4 py-2 text-3xl font-black text-green-400">
            YUMMY
          </span>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center rounded-3xl border-4 border-red-400 bg-red-400/10"
          style={{ opacity: noOpacity }}
        >
          <span className="rotate-[20deg] rounded-xl border-4 border-red-400 px-4 py-2 text-3xl font-black text-red-400">
            NOPE
          </span>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16">
          <h2 className="text-xl font-bold text-white">{restaurant.name}</h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              {restaurant.cuisine}
            </span>
            <span className="text-sm font-medium text-white/80">{restaurant.priceRange}</span>
          </div>
          <p className="mt-1 text-xs text-white/60 truncate">{restaurant.address}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
