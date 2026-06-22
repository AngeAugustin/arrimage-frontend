/**
 * @file    Drawer.tsx
 * @module  components/ui
 */

import { useEffect } from 'react';
import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  className,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-300',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 transition-opacity"
        aria-label="Fermer"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col border-l border-cnss-border bg-white shadow-login transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
          className,
        )}
      >
        <div className="border-b border-cnss-border px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="drawer-title" className="text-xl font-bold text-cnss-navy">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-sm text-cnss-text-muted">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-cnss-text-muted transition-colors hover:bg-cnss-input-bg hover:text-cnss-text"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

        {footer && (
          <div className="border-t border-cnss-border px-6 py-4">{footer}</div>
        )}
      </aside>
    </div>
  );
}
