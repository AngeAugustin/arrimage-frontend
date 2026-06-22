/**
 * @file    cn.ts
 * @module  utils
 * @desc    Utilitaire de fusion de classes CSS (classnames).
 * @author  CNSS–DSI
 * @since   2026-06
 */

/**
 * Fusionne des classes CSS conditionnelles en une seule chaîne.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
