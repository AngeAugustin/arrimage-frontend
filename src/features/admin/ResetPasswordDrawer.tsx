/**
 * @file    ResetPasswordDrawer.tsx
 * @module  features/admin
 */

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { IconAlert, IconCheckCircle, IconDownload } from '@/components/ui/icons';
import { RoleBadge } from '@/features/admin/adminShared';
import { downloadConnectionInfoDocx } from '@/utils/downloadConnectionInfoDocx';
import type { AdminUser } from '@/types/admin';

interface ResetPasswordDrawerProps {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  temporaryPassword?: string | null;
  error?: string | null;
}

function RecapRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-sm text-cnss-text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-cnss-navy">{value}</span>
    </div>
  );
}

export function ResetPasswordDrawer({
  open,
  user,
  onClose,
  onConfirm,
  isLoading = false,
  temporaryPassword = null,
  error = null,
}: ResetPasswordDrawerProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const isSuccess = Boolean(temporaryPassword);

  useEffect(() => {
    if (open && !temporaryPassword) {
      setDownloadError(null);
    }
  }, [open, temporaryPassword]);

  const handleDownloadDocx = async () => {
    if (!temporaryPassword || !user) return;
    setIsDownloading(true);
    setDownloadError(null);
    try {
      await downloadConnectionInfoDocx({
        nom: user.nom,
        prenom: user.prenom,
        login: user.username,
        password: temporaryPassword,
      });
    } catch (err) {
      console.error('Échec génération DOCX:', err);
      setDownloadError('Impossible de générer le document Word. Réessayez.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!user) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isSuccess ? 'Mot de passe réinitialisé' : 'Réinitialiser le mot de passe'}
      subtitle={
        isSuccess
          ? 'Téléchargez le document Word pour transmettre le nouveau mot de passe temporaire à l\'agent.'
          : `Confirmez la réinitialisation du mot de passe de ${user.prenom} ${user.nom}`
      }
      footer={
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {isSuccess ? 'Fermer' : 'Annuler'}
          </Button>
          {!isSuccess && (
            <Button
              className="flex-1"
              onClick={onConfirm}
              isLoading={isLoading}
            >
              Réinitialiser le mot de passe
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
              Le mot de passe de <strong>{user.prenom} {user.nom}</strong> a été réinitialisé.
              Téléchargez le fichier Word contenant ses nouveaux identifiants de connexion.
            </p>
          </div>

          <div className="rounded-lg border border-cnss-border bg-cnss-input-bg/50 px-4 py-2">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Récapitulatif
            </p>
            <RecapRow label="Nom" value={user.nom} />
            <RecapRow label="Prénom" value={user.prenom} />
            <RecapRow label="Identifiant" value={user.username} />
            <RecapRow label="Rôle" value={<RoleBadge role={user.role} />} />
          </div>

          <div className="rounded-lg border border-cnss-border bg-cnss-input-bg/50 p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Document de connexion
            </p>
            <p className="mb-4 text-sm text-cnss-text">
              Le mot de passe temporaire et les informations de connexion sont inclus dans le
              document Word, conforme au modèle CNSS.
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
          <div className="flex items-start gap-3 rounded-lg bg-cnss-error-bg px-4 py-4 text-cnss-error-text">
            <IconAlert className="mt-0.5 h-5 w-5 shrink-0 text-cnss-error" />
            <p className="text-sm">
              Un nouveau mot de passe temporaire sera généré. L&apos;utilisateur devra le changer
              à sa prochaine connexion. Son identifiant, son nom et son prénom resteront inchangés.
            </p>
          </div>

          <div className="rounded-lg border border-cnss-border bg-cnss-input-bg/50 px-4 py-2">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Utilisateur concerné
            </p>
            <RecapRow label="Nom" value={user.nom} />
            <RecapRow label="Prénom" value={user.prenom} />
            <RecapRow label="Identifiant" value={user.username} />
            <RecapRow label="Rôle" value={<RoleBadge role={user.role} />} />
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
