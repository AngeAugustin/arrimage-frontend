/**
 * @file    GuestRoute.tsx
 * @module  components/layout
 * @desc    Route réservée aux visiteurs non authentifiés (ex. page de connexion).
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/ui/Spinner';
import { ROLE_DASHBOARD } from '@/utils/constants';

/**
 * Redirige les utilisateurs déjà connectés vers leur tableau de bord.
 */
export function GuestRoute() {
  const { user, isAuthenticated, isFirstConnexion, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cnss-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    if (isFirstConnexion) {
      return <Navigate to="/change-password" replace />;
    }
    return <Navigate to={ROLE_DASHBOARD[user.role] ?? '/'} replace />;
  }

  return <Outlet />;
}
