/**
 * @file    schemas.ts
 * @module  features/agent1
 * @desc    Schémas Zod pour les formulaires de saisie IFU.
 *
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { z } from 'zod';
import { IFU_LENGTH } from '@/utils/constants';

const ifuField = z
  .string()
  .min(1, 'Ce champ est obligatoire.')
  .length(IFU_LENGTH, `L'IFU doit contenir exactement ${IFU_LENGTH} chiffres.`)
  .regex(/^\d+$/, "L'IFU ne doit contenir que des chiffres.");

export const saisieSchema = z
  .object({
    numCnss: z.string().min(1, 'Le numéro CNSS est obligatoire.'),
    ifu: ifuField,
    ifuConfirmation: ifuField,
  })
  .refine((data) => data.ifu === data.ifuConfirmation, {
    message: 'Les deux IFU saisis ne correspondent pas. Recommencez la saisie.',
    path: ['ifuConfirmation'],
  });

export const ifuOnlySchema = z
  .object({
    ifu: ifuField,
    ifuConfirmation: ifuField,
  })
  .refine((data) => data.ifu === data.ifuConfirmation, {
    message: 'Les deux IFU saisis ne correspondent pas. Recommencez la saisie.',
    path: ['ifuConfirmation'],
  });

export type SaisieFormData = z.infer<typeof saisieSchema>;
export type IfuFormData = z.infer<typeof ifuOnlySchema>;
