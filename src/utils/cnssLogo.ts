/**
 * @file    cnssLogo.ts
 * @module  utils
 * @desc    Logo CNSS embarqué (base64) pour les exports document.
 */

import templateHtml from '@/assets/templates/Modele_info_connexion_utilisateur.html?raw';

/**
 * Retourne le logo CNSS en data URL PNG, ou null si introuvable.
 */
export function getCnssLogoDataUrl(): string | null {
  const match = templateHtml.match(/data:image\/png;base64,([^"]+)/);
  if (!match?.[1]) return null;
  return `data:image/png;base64,${match[1]}`;
}
