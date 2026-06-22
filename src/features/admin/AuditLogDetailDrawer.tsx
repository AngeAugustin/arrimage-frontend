/**
 * @file    AuditLogDetailDrawer.tsx
 * @module  features/admin
 */

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { IconCheckCircle, IconDownload, IconXCircle } from '@/components/ui/icons';
import { ActionBadge, RoleBadge, isAuditFailure } from '@/features/admin/adminShared';
import { formatAuditTimestamp } from '@/utils/formatDate';
import {
  buildAuditModifiedValues,
  formatAuditEntiteCible,
  formatAuditLogId,
} from '@/utils/formatAuditLog';
import { downloadAuditProofPdf } from '@/utils/auditProofPdf';
import type { AuditEntry } from '@/types/admin';
import type { UserRole } from '@/types/auth';

interface AuditLogDetailDrawerProps {
  open: boolean;
  entry: AuditEntry | null;
  role: UserRole | null;
  onClose: () => void;
}

function DetailLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
      {children}
    </p>
  );
}

function DetailField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <DetailLabel>{label}</DetailLabel>
      <div className="text-sm font-medium text-cnss-navy">{children}</div>
    </div>
  );
}

export function AuditLogDetailDrawer({
  open,
  entry,
  role,
  onClose,
}: AuditLogDetailDrawerProps) {
  if (!entry) {
    return (
      <Drawer open={false} onClose={onClose} title="Détails de l'action">
        <div />
      </Drawer>
    );
  }

  const failed = isAuditFailure(entry);
  const jsonContent = JSON.stringify(buildAuditModifiedValues(entry), null, 2);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Détails de l'action"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Fermer
          </Button>
          <Button
            className="flex-1"
            onClick={() => downloadAuditProofPdf(entry, role)}
            title="Télécharger une preuve au format PDF"
          >
            <IconDownload className="h-4 w-4" />
            Télécharger preuve
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <DetailLabel>Identifiant log</DetailLabel>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-cnss-border bg-cnss-input-bg px-4 py-3">
            <span className="font-mono text-sm font-semibold text-cnss-navy">
              {formatAuditLogId(entry)}
            </span>
            {failed ? (
              <IconXCircle
                className="h-5 w-5 shrink-0 text-cnss-error"
                aria-label="Échec"
              />
            ) : (
              <IconCheckCircle
                className="h-5 w-5 shrink-0 text-cnss-success"
                aria-label="Succès"
              />
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailField label="Date & Heure">
            <span className="font-mono text-xs">{formatAuditTimestamp(entry.timestamp)}</span>
          </DetailField>
          <DetailField label="Action">
            <ActionBadge action={entry.action} />
          </DetailField>
          <DetailField label="Utilisateur">
            {entry.user ? (
              <span>
                {entry.user.prenom} {entry.user.nom}
                <span className="mt-0.5 block text-xs font-normal text-cnss-text-muted">
                  @{entry.user.username}
                </span>
              </span>
            ) : (
              '—'
            )}
          </DetailField>
          <DetailField label="Rôle">
            {role ? <RoleBadge role={role} /> : <span className="text-xs">SYS</span>}
          </DetailField>
          <DetailField label="Entité cible">
            {formatAuditEntiteCible(entry.entiteCible)}
          </DetailField>
          <DetailField label="User IP">
            {entry.ipAddress ?? '—'}
          </DetailField>
        </div>

        <div>
          <DetailLabel>Valeurs modifiées (JSON)</DetailLabel>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
            <code>{jsonContent}</code>
          </pre>
        </div>
      </div>
    </Drawer>
  );
}
