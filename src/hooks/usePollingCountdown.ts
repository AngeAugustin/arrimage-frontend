/**
 * @file    usePollingCountdown.ts
 * @module  hooks
 */

import { useEffect, useState } from 'react';

/**
 * Compte à rebours avant le prochain rafraîchissement automatique.
 */
export function usePollingCountdown(intervalMs: number, resetKey: string | null) {
  const [secondsLeft, setSecondsLeft] = useState(Math.floor(intervalMs / 1000));

  useEffect(() => {
    setSecondsLeft(Math.floor(intervalMs / 1000));
  }, [resetKey, intervalMs]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? Math.floor(intervalMs / 1000) : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return secondsLeft;
}
