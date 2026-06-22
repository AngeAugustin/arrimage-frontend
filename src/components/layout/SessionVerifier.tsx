/**
 * @file    SessionVerifier.tsx
 * @module  components/layout
 * @desc    Vérifie la session JWT au démarrage de l'application.
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/authApi';

interface SessionVerifierProps {
  children: React.ReactNode;
}

/**
 * Tente de restaurer la session utilisateur via le cookie access_token.
 */
export function SessionVerifier({ children }: SessionVerifierProps) {
  const { setUser, logout, setLoading } = useAuthStore();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await authApi.me();
        setUser(response.user, response.isFirstConnexion);
      } catch {
        try {
          await authApi.refresh();
          const response = await authApi.me();
          setUser(response.user, response.isFirstConnexion);
        } catch {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    void verifySession();
  }, [setUser, logout, setLoading]);

  return <>{children}</>;
}
