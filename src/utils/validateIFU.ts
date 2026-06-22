/**
 * @file    validateIFU.ts
 * @module  utils
 * @desc    Validation du format IFU (13 chiffres exactement).
 *
 * Règles métier couvertes :
 *   - RG-16 : IFU = 13 chiffres
 *
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { z } from 'zod';
import { IFU_LENGTH } from './constants';

export const ifuSchema = z
  .string()
  .min(1, 'Ce champ est obligatoire.')
  .length(IFU_LENGTH, "L'IFU doit contenir exactement 13 chiffres.")
  .regex(/^\d+$/, "L'IFU ne doit contenir que des chiffres.");

/**
 * Valide qu'un IFU respecte le format attendu : 13 chiffres exactement.
 *
 * @param ifu - Chaîne à valider
 * @returns true si valide, false sinon
 */
export function validateIFU(ifu: string): boolean {
  return ifuSchema.safeParse(ifu).success;
}
