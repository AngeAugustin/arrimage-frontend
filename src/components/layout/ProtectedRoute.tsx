/**
 * @file    ProtectedRoute.tsx
 * @module  components/layout
 * @desc    Route protégée par authentification et rôle utilisateur.
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/ui/Spinner';
import type { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  roles?: UserRole[];
}

/**
 * Vérifie l'authentification, la première connexion et le rôle avant d'afficher la route.
 */
export function ProtectedRoute({ roles = [] }: ProtectedRouteProps) {
  const { user, isAuthenticated, isFirstConnexion, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cnss-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (isFirstConnexion && window.location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
