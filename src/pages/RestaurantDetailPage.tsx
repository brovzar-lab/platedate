import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import restaurants from '../data/austinRestaurants.json';
import type { Restaurant } from '../types/restaurant';

const allRestaurants = restaurants as Restaurant[];

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const restaurant = allRestaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">Restaurant not found.</p>
          <Link to="/matches" className="mt-4 block text-rose-500 hover:underline">
            Back to Matches
          </Link>
        </div>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-72">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
        >
          ←
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 py-6"
      >
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-black text-slate-900">{restaurant.name}</h1>
          <span className="text-xl font-semibold text-slate-500">{restaurant.priceRange}</span>
        </div>

        <span className="mt-2 inline-block rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-600">
          {restaurant.cuisine}
        </span>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">📍</span>
            <div>
              <p className="text-sm font-medium text-slate-700">Address</p>
              <p className="text-sm text-slate-500">{restaurant.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">🕐</span>
            <div>
              <p className="text-sm font-medium text-slate-700">Hours</p>
              <p className="text-sm text-slate-500">{restaurant.hours}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">📞</span>
            <div>
              <p className="text-sm font-medium text-slate-700">Phone</p>
              <a href={`tel:${restaurant.phone}`} className="text-sm text-rose-500 hover:underline">
                {restaurant.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-6 py-4 font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-600 active:scale-95"
          >
            🗺️ Get Directions
          </a>
          <a
            href={restaurant.menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-6 py-4 font-semibold text-slate-700 transition-all hover:bg-slate-200 active:scale-95"
          >
            📋 View Menu
          </a>
        </div>
      </motion.div>
    </div>
  );
}
