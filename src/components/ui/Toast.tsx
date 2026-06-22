/**
 * @file    Toast.tsx
 * @module  components/ui
 * @desc    Conteneur de notifications toast en haut à droite.
 */

import { IconCheckCircle, IconXCircle } from '@/components/ui/icons';
import { useToastStore, type ToastVariant } from '@/store/toastStore';
import { cn } from '@/utils/cn';

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-cnss-success/30 bg-cnss-success-bg text-cnss-success',
  error: 'border-cnss-error/30 bg-cnss-error-bg text-cnss-error-text',
};

function ToastItem({ id, message, variant }: { id: string; message: string; variant: ToastVariant }) {
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border px-4 py-3 shadow-lg',
        'animate-[toast-in_0.25s_ease-out]',
        variantStyles[variant],
      )}
    >
      {variant === 'success' ? (
        <IconCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
      ) : (
        <IconXCircle className="mt-0.5 h-5 w-5 shrink-0 text-cnss-error" />
      )}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={() => dismiss(id)}
        className="shrink-0 text-xs opacity-70 transition-opacity hover:opacity-100"
        aria-label="Fermer la notification"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed right-6 top-20 z-50 flex w-full max-w-md flex-col items-end gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}
