export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  address: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  hours: string;
  phone: string;
  menuUrl: string;
  imageUrl: string;
  tier: string;
  claimedByUserId: string | null;
  stats: {
    impressions: number;
    swipeRights: number;
    matches: number;
  };
}
