import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { CoupleSetupPage } from './pages/CoupleSetupPage';
import { SwipeDeckPage } from './pages/SwipeDeckPage';
import { MatchedListPage } from './pages/MatchedListPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';

export function App() {
  return (
    <div className="mx-auto min-h-screen max-w-sm">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/create" element={<CoupleSetupPage />} />
        <Route path="/join" element={<CoupleSetupPage />} />
        <Route path="/swipe" element={<SwipeDeckPage />} />
        <Route path="/matches" element={<MatchedListPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
