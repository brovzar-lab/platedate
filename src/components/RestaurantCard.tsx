import { Link } from 'react-router-dom';
import type { Restaurant } from '../types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{restaurant.name}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600">
            {restaurant.cuisine}
          </span>
          <span>{restaurant.priceRange}</span>
        </div>
        <p className="mt-1 text-xs text-slate-400 truncate">{restaurant.address}</p>
      </div>
    </Link>
  );
}
