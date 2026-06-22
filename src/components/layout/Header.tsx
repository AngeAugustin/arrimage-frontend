/**
 * @file    Header.tsx
 * @module  components/layout
 */

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getUserInitials } from '@/utils/roleLabels';

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between bg-cnss-header px-4 shadow-card">
      <p className="text-base font-bold text-white">
        Caisse Nationale de Sécurité Sociale
      </p>
      {user && (
        <button
          type="button"
          onClick={() => navigate('/profil')}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-cnss-avatar text-sm font-bold text-cnss-blue transition-opacity hover:opacity-80"
          title={`${user.prenom} ${user.nom}`}
          aria-label="Mon profil"
        >
          {getUserInitials(user.prenom, user.nom)}
        </button>
      )}
    </header>
  );
}
