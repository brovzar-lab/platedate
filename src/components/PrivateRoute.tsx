import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isDemoMode } from '../lib/demo';

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500" />
    </div>
  );
}

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useAuth();
  if (isDemoMode) return <>{children}</>;
  if (loading) return <Spinner />;
  if (!currentUser) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export function CoupleRoute({ children }: { children: ReactNode }) {
  const { currentUser, userDoc, loading } = useAuth();
  if (isDemoMode) return <>{children}</>;
  if (loading) return <Spinner />;
  if (!currentUser) return <Navigate to="/auth" replace />;
  if (!userDoc?.coupleId) return <Navigate to="/create" replace />;
  return <>{children}</>;
}
