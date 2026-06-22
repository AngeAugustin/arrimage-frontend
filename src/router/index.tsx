/**
 * @file    index.tsx
 * @module  router
 * @desc    Configuration React Router v6 avec routes protégées par rôle.
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { GuestRoute } from '@/components/layout/GuestRoute';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardPage } from '@/features/admin/DashboardPage';
import { ConsolidationPage } from '@/features/admin/ConsolidationPage';
import { UsersPage } from '@/features/admin/UsersPage';
import { AuditPage } from '@/features/admin/AuditPage';
import { Agent1DashboardPage } from '@/features/agent1/Agent1DashboardPage';
import { Agent1NouvelleSaisiePage } from '@/features/agent1/Agent1NouvelleSaisiePage';
import { Agent2DashboardPage } from '@/features/agent2/Agent2DashboardPage';
import { Agent2NouvelleContresaisiePage } from '@/features/agent2/Agent2NouvelleContresaisiePage';
import { ControleurDashboardPage } from '@/features/controleur/ControleurDashboardPage';
import { ChangePasswordPage } from '@/features/auth/ChangePasswordPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { ProfilePage } from '@/features/shared/ProfilePage';
import { ROLE_DASHBOARD } from '@/utils/constants';
import { useAuthStore } from '@/store/authStore';

function HomeRedirect() {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_DASHBOARD[user.role] ?? '/login'} replace />;
}

/**
 * Définition de toutes les routes de l'application.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/change-password" element={<ChangePasswordPage />} />

        <Route path="/unauthorized" element={
          <div className="flex min-h-screen items-center justify-center bg-cnss-bg">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">Accès refusé</h1>
              <p className="mt-2 text-gray-500">Vous n&apos;avez pas les droits pour accéder à cette page.</p>
            </div>
          </div>
        } />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route element={<AppLayout />}>
            <Route path="/profil" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['agent1']} />}>
          <Route element={<AppLayout />}>
            <Route path="/agent1/dashboard" element={<Agent1DashboardPage />} />
            <Route path="/agent1/saisie" element={<Agent1NouvelleSaisiePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['agent2']} />}>
          <Route element={<AppLayout />}>
            <Route path="/agent2/dashboard" element={<Agent2DashboardPage />} />
            <Route path="/agent2/contresaisie" element={<Agent2NouvelleContresaisiePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['controleur']} />}>
          <Route element={<AppLayout />}>
            <Route path="/controleur/dashboard" element={<ControleurDashboardPage />} />
            <Route path="/controleur/discordances" element={<Navigate to="/controleur/dashboard" replace />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/consolidation" element={<ConsolidationPage />} />
            <Route path="/admin/utilisateurs" element={<UsersPage />} />
            <Route path="/admin/audit" element={<AuditPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
