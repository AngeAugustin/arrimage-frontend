/**
 * @file    auditProofPdf.ts
 * @module  utils
 * @desc    Génération PDF de preuve pour une entrée du journal d'audit.
 */

import { jsPDF } from 'jspdf';
import { isAuditFailure } from '@/features/admin/adminShared';
import type { AuditEntry } from '@/types/admin';
import type { UserRole } from '@/types/auth';
import { formatAuditTimestamp } from '@/utils/formatDate';
import {
  buildAuditModifiedValues,
  formatAuditEntiteCible,
  formatAuditLogId,
} from '@/utils/formatAuditLog';
import { ROLE_LABELS } from '@/utils/roleLabels';
import { getCnssLogoDataUrl } from '@/utils/cnssLogo';

const MARGIN = 20;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 5;
const HEADER_HEIGHT = 26;
const LOGO_SIZE = 10;

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, x, y);
  return y + lines.length * LINE_HEIGHT;
}

function addField(doc: jsPDF, label: string, value: string, y: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(122, 143, 166);
  doc.text(label.toUpperCase(), MARGIN, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(4, 44, 83);
  return addWrappedText(doc, value, MARGIN, y + 4.5, CONTENT_WIDTH) + 6;
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed <= 285) return y;
  doc.addPage();
  return MARGIN;
}

/**
 * Télécharge une preuve d'audit au format PDF.
 */
export function downloadAuditProofPdf(entry: AuditEntry, role: UserRole | null): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const logId = formatAuditLogId(entry);
  const failed = isAuditFailure(entry);

  doc.setFillColor(24, 57, 165);
  doc.rect(0, 0, PAGE_WIDTH, HEADER_HEIGHT, 'F');

  const logoDataUrl = getCnssLogoDataUrl();
  const logoY = (HEADER_HEIGHT - LOGO_SIZE) / 2;
  let titleX = MARGIN;

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', MARGIN, logoY, LOGO_SIZE, LOGO_SIZE);
    titleX = MARGIN + LOGO_SIZE + 3;
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Preuve d\'audit — CNSS Arrimage IFU', titleX, 17);

  let y = 38;
  doc.setFontSize(13);
  doc.setTextColor(4, 44, 83);
  doc.text(logId, MARGIN, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  if (failed) {
    doc.setTextColor(186, 26, 26);
    doc.text('Statut : Échec', MARGIN, y);
  } else {
    doc.setTextColor(10, 102, 64);
    doc.text('Statut : Succès', MARGIN, y);
  }
  y += 12;

  const userLabel = entry.user
    ? `${entry.user.prenom} ${entry.user.nom} (@${entry.user.username})`
    : '—';
  const roleLabel = role ? ROLE_LABELS[role] : 'SYS';

  y = addField(doc, 'Date et heure', formatAuditTimestamp(entry.timestamp), y);
  y = addField(doc, 'Action', entry.action, y);
  y = addField(doc, 'Utilisateur', userLabel, y);
  y = addField(doc, 'Rôle', roleLabel, y);
  y = addField(doc, 'Entité cible', formatAuditEntiteCible(entry.entiteCible), y);
  y = addField(doc, 'Adresse IP', entry.ipAddress ?? '—', y);

  y = ensureSpace(doc, y + 4, 20);
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(122, 143, 166);
  doc.text('VALEURS MODIFIÉES', MARGIN, y);
  y += 5;

  const jsonText = JSON.stringify(buildAuditModifiedValues(entry), null, 2);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(66, 71, 81);

  const jsonLines = doc.splitTextToSize(jsonText, CONTENT_WIDTH) as string[];
  for (const line of jsonLines) {
    y = ensureSpace(doc, y, 5);
    doc.text(line, MARGIN, y);
    y += 4.2;
  }

  y = ensureSpace(doc, y + 6, 8);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(122, 143, 166);
  doc.text(`Document généré le ${formatAuditTimestamp(new Date().toISOString())}`, MARGIN, y + 6);

  const filename = `preuve-audit-${logId.replace('#', '')}.pdf`;
  doc.save(filename);
}
