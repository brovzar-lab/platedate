import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute, CoupleRoute } from './components/PrivateRoute';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { CoupleSetupPage } from './pages/CoupleSetupPage';
import { SwipeDeckPage } from './pages/SwipeDeckPage';
import { MatchedListPage } from './pages/MatchedListPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';

export function App() {
  return (
    <AuthProvider>
      <div className="mx-auto min-h-screen max-w-sm">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/create" element={<PrivateRoute><CoupleSetupPage /></PrivateRoute>} />
          <Route path="/join" element={<PrivateRoute><CoupleSetupPage /></PrivateRoute>} />
          <Route path="/swipe" element={<CoupleRoute><SwipeDeckPage /></CoupleRoute>} />
          <Route path="/matches" element={<CoupleRoute><MatchedListPage /></CoupleRoute>} />
          <Route path="/restaurant/:id" element={<PrivateRoute><RestaurantDetailPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
