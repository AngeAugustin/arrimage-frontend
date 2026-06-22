/**
 * @file    usePolling.ts
 * @module  hooks
 * @desc    Hook de polling avec pause automatique si onglet masqué (RG-10).
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { useEffect, useRef } from 'react';

/**
 * Exécute un callback à intervalle régulier, avec pause si l'onglet est masqué.
 */
export function usePolling(
  callback: () => void | Promise<void>,
  intervalMs: number = 30_000,
  enabled: boolean = true,
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    void callbackRef.current();

    const tick = () => void callbackRef.current();
    let intervalId = setInterval(tick, intervalMs);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        clearInterval(intervalId);
      } else {
        void callbackRef.current();
        intervalId = setInterval(tick, intervalMs);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intervalMs, enabled]);
}
