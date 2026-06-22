/**
 * @file    CreateUserDrawer.tsx
 * @module  features/admin
 */

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { Input } from '@/components/ui/Input';
import { IconCheckCircle, IconDownload } from '@/components/ui/icons';
import { RoleBadge } from '@/features/admin/adminShared';
import { ROLE_LABELS } from '@/utils/roleLabels';
import { generateUsername } from '@/utils/generateUsername';
import { downloadConnectionInfoDocx } from '@/utils/downloadConnectionInfoDocx';
import { cn } from '@/utils/cn';
import type { UserRole } from '@/types/auth';

const ROLES: UserRole[] = ['agent1', 'agent2', 'controleur', 'admin'];

export interface CreateUserFormValues {
  username: string;
  nom: string;
  prenom: string;
  role: UserRole | '';
}

interface CreateUserDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateUserFormValues) => void;
  isLoading?: boolean;
  createdPassword?: string | null;
  error?: string | null;
}

const EMPTY_FORM: CreateUserFormValues = {
  username: '',
  nom: '',
  prenom: '',
  role: '',
};

function RecapRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-sm text-cnss-text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-cnss-navy">{value}</span>
    </div>
  );
}

export function CreateUserDrawer({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  createdPassword = null,
  error = null,
}: CreateUserDrawerProps) {
  const [form, setForm] = useState<CreateUserFormValues>(EMPTY_FORM);
  const [usernameEdited, setUsernameEdited] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const isSuccess = Boolean(createdPassword);

  useEffect(() => {
    if (open && !createdPassword) {
      setForm(EMPTY_FORM);
      setUsernameEdited(false);
      setDownloadError(null);
    }
  }, [open, createdPassword]);

  const updateNom = (nom: string) => {
    setForm((f) => {
      const next = { ...f, nom };
      if (!usernameEdited) {
        next.username = generateUsername(nom, f.prenom);
      }
      return next;
    });
  };

  const updatePrenom = (prenom: string) => {
    setForm((f) => {
      const next = { ...f, prenom };
      if (!usernameEdited) {
        next.username = generateUsername(f.nom, prenom);
      }
      return next;
    });
  };

  const handleDownloadDocx = async () => {
    if (!createdPassword) return;
    setIsDownloading(true);
    setDownloadError(null);
    try {
      await downloadConnectionInfoDocx({
        nom: form.nom,
        prenom: form.prenom,
        login: form.username,
        password: createdPassword,
      });
    } catch (err) {
      console.error('Échec génération DOCX:', err);
      setDownloadError('Impossible de générer le document Word. Réessayez.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.role) return;
    onSubmit(form as CreateUserFormValues & { role: UserRole });
  };

  const canSubmit =
    form.nom.trim() !== '' &&
    form.prenom.trim() !== '' &&
    form.username.trim() !== '' &&
    form.role !== '';

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isSuccess ? 'Compte créé avec succès' : 'Créer un utilisateur'}
      subtitle={
        isSuccess
          ? 'Téléchargez le document Word pour transmettre les informations de connexion à l\'agent.'
          : 'Ajoutez un nouvel agent au système'
      }
      footer={
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {isSuccess ? 'Fermer' : 'Annuler'}
          </Button>
          {!isSuccess && (
            <Button
              className="flex-1"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!canSubmit}
            >
              Créer le compte
            </Button>
          )}
        </div>
      }
    >
      {isSuccess ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-lg border border-cnss-success/30 bg-cnss-success-bg px-4 py-4">
            <IconCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-cnss-success" />
            <p className="text-sm text-cnss-success">
              L&apos;utilisateur <strong>{form.prenom} {form.nom}</strong> a été créé.
              Téléchargez le fichier Word contenant ses identifiants de connexion.
            </p>
          </div>

          <div className="rounded-lg border border-cnss-border bg-cnss-input-bg/50 px-4 py-2">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Récapitulatif
            </p>
            <RecapRow label="Nom" value={form.nom} />
            <RecapRow label="Prénom" value={form.prenom} />
            <RecapRow label="Identifiant" value={form.username} />
            <RecapRow
              label="Rôle"
              value={form.role ? <RoleBadge role={form.role} /> : '—'}
            />
          </div>

          <div className="rounded-lg border border-cnss-border bg-cnss-input-bg/50 p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Document de connexion
            </p>
            <p className="mb-4 text-sm text-cnss-text">
              Le mot de passe et les informations de connexion sont inclus dans le document Word,
              conforme au modèle CNSS.
            </p>
            <Button
              className="w-full"
              onClick={() => void handleDownloadDocx()}
              isLoading={isDownloading}
            >
              <IconDownload className="h-4 w-4" />
              Télécharger les informations de connexion (.docx)
            </Button>
            {downloadError && (
              <p className="mt-3 text-sm text-cnss-error">{downloadError}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nom"
              uppercaseLabel={false}
              placeholder="Ex: Salami"
              value={form.nom}
              onChange={(e) => updateNom(e.target.value)}
            />
            <Input
              label="Prénom"
              uppercaseLabel={false}
              placeholder="Ex: Koffi"
              value={form.prenom}
              onChange={(e) => updatePrenom(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="create-username"
              className="text-[11px] font-bold tracking-wider text-cnss-text"
            >
              Identifiant
            </label>
            <input
              id="create-username"
              type="text"
              placeholder="afacheho"
              value={form.username}
              onChange={(e) => {
                setUsernameEdited(true);
                setForm((f) => ({ ...f, username: e.target.value }));
              }}
              className="h-[46px] w-full rounded border border-cnss-border bg-cnss-input-bg px-4 text-sm text-cnss-navy placeholder:text-cnss-placeholder focus:border-cnss-primary focus:outline-none focus:ring-2 focus:ring-cnss-primary/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="create-role"
              className="text-[11px] font-bold tracking-wider text-cnss-text"
            >
              Rôle
            </label>
            <select
              id="create-role"
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({ ...f, role: e.target.value as UserRole | '' }))
              }
              className={cn(
                'h-[46px] w-full rounded border border-cnss-border bg-cnss-input-bg px-4 text-sm focus:border-cnss-primary focus:outline-none focus:ring-2 focus:ring-cnss-primary/20',
                form.role === '' ? 'text-cnss-placeholder' : 'text-cnss-navy',
              )}
            >
              <option value="">Sélectionnez un rôle</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
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
      )}
    </Drawer>
  );
}
