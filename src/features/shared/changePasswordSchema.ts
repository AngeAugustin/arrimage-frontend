/**
 * @file    changePasswordSchema.ts
 * @module  features/shared
 */

import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est obligatoire.'),
    newPassword: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule.')
      .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre.'),
    confirmPassword: z.string().min(1, 'La confirmation est obligatoire.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const firstConnexionPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(12, 'Le mot de passe doit contenir au moins 12 caractères.')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule.')
      .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre.')
      .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial.'),
    confirmPassword: z.string().min(1, 'La confirmation est obligatoire.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['confirmPassword'],
  });

export type FirstConnexionPasswordFormData = z.infer<typeof firstConnexionPasswordSchema>;
