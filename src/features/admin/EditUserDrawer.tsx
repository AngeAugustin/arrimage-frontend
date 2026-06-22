/**
 * @file    EditUserDrawer.tsx
 * @module  features/admin
 */

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { Input } from '@/components/ui/Input';
import { ROLE_LABELS } from '@/utils/roleLabels';
import type { AdminUser } from '@/types/admin';
import type { UserRole } from '@/types/auth';

const ROLES: UserRole[] = ['agent1', 'agent2', 'controleur', 'admin'];

interface EditUserDrawerProps {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onSubmit: (values: { nom: string; prenom: string; role: UserRole }) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function EditUserDrawer({
  open,
  user,
  onClose,
  onSubmit,
  isLoading = false,
  error = null,
}: EditUserDrawerProps) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [role, setRole] = useState<UserRole>('agent1');

  useEffect(() => {
    if (user && open) {
      setNom(user.nom);
      setPrenom(user.prenom);
      setRole(user.role);
    }
  }, [user, open]);

  if (!user) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Modifier l'utilisateur"
      subtitle={`${user.prenom} ${user.nom} — ${user.username}`}
      footer={
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Annuler
          </Button>
          <Button
            className="flex-1"
            onClick={() => onSubmit({ nom, prenom, role })}
            isLoading={isLoading}
          >
            Enregistrer
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nom"
            uppercaseLabel={false}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          <Input
            label="Prénom"
            uppercaseLabel={false}
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="edit-role"
            className="text-[11px] font-bold tracking-wider text-cnss-text"
          >
            Rôle
          </label>
          <select
            id="edit-role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="h-[46px] w-full rounded border border-cnss-border bg-cnss-input-bg px-4 text-sm text-cnss-navy focus:border-cnss-primary focus:outline-none focus:ring-2 focus:ring-cnss-primary/20"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded-lg border border-cnss-error/30 bg-cnss-error-bg px-4 py-3 text-sm text-cnss-error-text">
            {error}
          </div>
        )}
      </div>
    </Drawer>
  );
}
