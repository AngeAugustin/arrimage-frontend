/**
 * @file    validateIFU.test.ts
 * @module  utils
 * @desc    Tests de validation du format IFU (RG-16).
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { describe, expect, it } from 'vitest';
import { validateIFU, ifuSchema } from './validateIFU';

describe('validateIFU', () => {
  it('accepte un IFU de 13 chiffres', () => {
    expect(validateIFU('1234567890123')).toBe(true);
  });

  it('rejette un IFU trop court', () => {
    expect(validateIFU('123456789012')).toBe(false);
  });

  it('rejette un IFU avec des lettres', () => {
    expect(validateIFU('123456789012A')).toBe(false);
  });

  it('rejette une chaîne vide', () => {
    expect(validateIFU('')).toBe(false);
  });
});

describe('ifuSchema', () => {
  it('retourne le message standard pour un format invalide', () => {
    const result = ifuSchema.safeParse('abc');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('13 chiffres');
    }
  });
});
