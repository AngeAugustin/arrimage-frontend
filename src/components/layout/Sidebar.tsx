/**
 * @file    Sidebar.tsx
 * @module  components/layout
 */

import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Layers,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';
import { ROLE_LABELS } from '@/utils/roleLabels';
import type { UserRole } from '@/types/auth';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface NavItem {
  label: string;
  to: string;
  roles: UserRole[];
  icon: LucideIcon;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de bord', to: '/agent1/dashboard', roles: ['agent1'], icon: LayoutDashboard },
  { label: 'Profil', to: '/profil', roles: ['agent1'], icon: UserCircle },
  { label: 'Tableau de bord', to: '/agent2/dashboard', roles: ['agent2'], icon: LayoutDashboard },
  { label: 'Profil', to: '/profil', roles: ['agent2'], icon: UserCircle },
  { label: 'Tableau de bord', to: '/controleur/dashboard', roles: ['controleur'], icon: LayoutDashboard },
  { label: 'Profil', to: '/profil', roles: ['controleur'], icon: UserCircle },
  { label: 'Tableau de bord', to: '/admin/dashboard', roles: ['admin'], icon: LayoutDashboard },
  { label: 'Gestion utilisateurs', to: '/admin/utilisateurs', roles: ['admin'], icon: Users },
  { label: 'Consolidation', to: '/admin/consolidation', roles: ['admin'], icon: Layers },
  { label: 'Journal d\'audit', to: '/admin/audit', roles: ['admin'], icon: ClipboardList },
  { label: 'Profil', to: '/profil', roles: ['admin'], icon: UserCircle },
];

function isNavActive(pathname: string, search: string, to: string): boolean {
  const [toPath, toQuery] = to.split('?');
  if (pathname !== toPath) return false;
  if (!toQuery) return !search || search === '';
  return search === `?${toQuery}`;
}

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const items = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate('/login');
    }
  };

  const closeLogoutConfirm = () => {
    if (isLoggingOut) return;
    setLogoutConfirmOpen(false);
  };

  return (
    <aside className="fixed left-0 top-14 z-20 flex h-[calc(100vh-3.5rem)] w-60 flex-col border-r border-cnss-border bg-white">
      <div className="border-b border-cnss-border px-6 py-5">
        <div className="flex items-center gap-3">
          <img
            src="/images/cnss-logo-sidebar-56586a.png"
            alt="CNSS Bénin"
            className="h-10 w-10 rounded object-cover"
          />
          <div>
            <p className="text-sm font-bold text-cnss-blue">Arrimage IFU</p>
            <p className="text-xs text-cnss-text">CNSS Bénin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={() => {
              const active = isNavActive(location.pathname, location.search, item.to);
              return cn(
                'mb-1 flex items-center gap-3 rounded-r-lg px-3 py-2.5 text-sm transition-colors',
                active
                  ? 'border-l-[3px] border-cnss-blue bg-cnss-active-nav font-medium text-cnss-blue'
                  : 'border-l-[3px] border-transparent text-cnss-text hover:bg-cnss-input-bg',
              );
            }}
          >
            <item.icon className="h-5 w-5 shrink-0" strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-cnss-border p-4">
        {user.role !== 'agent1' && user.role !== 'agent2' && user.role !== 'controleur' && user.role !== 'admin' && (
          <div className="mb-3 rounded-lg bg-cnss-role-bg p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cnss-blue">
              Rôle actuel
            </p>
            <p className="mt-1 text-sm font-bold text-cnss-blue">{ROLE_LABELS[user.role]}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setLogoutConfirmOpen(true)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cnss-error transition-colors hover:bg-cnss-error-bg"
        >
          <LogOut className="h-5 w-5" strokeWidth={2} />
          Déconnexion
        </button>
      </div>

      <Modal open={logoutConfirmOpen} onClose={closeLogoutConfirm} title="Confirmer la déconnexion">
        <p className="text-sm text-cnss-text">
          Voulez-vous vraiment vous déconnecter de la plateforme Arrimage IFU ?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={closeLogoutConfirm} disabled={isLoggingOut}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={() => void handleLogout()}
            isLoading={isLoggingOut}
          >
            Se déconnecter
          </Button>
        </div>
      </Modal>
    </aside>
  );
}
