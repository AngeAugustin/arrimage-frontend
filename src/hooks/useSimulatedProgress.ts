/**
 * @file    useSimulatedProgress.ts
 * @module  hooks
 * @desc    Progression simulée pour les opérations longues sans suivi serveur.
 */

import { useCallback, useEffect, useState } from 'react';

const ASYMPTOTE = 95;
const TICK_MS = 80;

export function useSimulatedProgress(
  isActive: boolean,
  estimatedSeconds: number,
): [number, () => void] {
  const [progress, setProgress] = useState(0);

  const complete = useCallback(() => {
    setProgress(100);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const durationMs = Math.max(estimatedSeconds * 1000, 8_000);
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const ratio = 1 - Math.exp(-elapsed / (durationMs * 0.35));
      setProgress(Math.min(ASYMPTOTE, ratio * ASYMPTOTE));
    };

    tick();
    const id = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(id);
  }, [isActive, estimatedSeconds]);

  return [progress, complete];
}
