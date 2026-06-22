/**
 * @file    generateUsername.ts
 * @module  utils
 * @desc    Génère un identifiant : 1re lettre du prénom + 7 premières lettres du nom.
 *          Ex. FACHEHOUN Augustin → afacheho
 */

function normalizeNamePart(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

export function generateUsername(nom: string, prenom: string): string {
  const normalizedNom = normalizeNamePart(nom.trim());
  const normalizedPrenom = normalizeNamePart(prenom.trim());

  if (!normalizedNom && !normalizedPrenom) return '';
  if (!normalizedPrenom) return normalizedNom.slice(0, 8);
  if (!normalizedNom) return normalizedPrenom.slice(0, 8);

  return `${normalizedPrenom.charAt(0)}${normalizedNom.slice(0, 7)}`;
}
