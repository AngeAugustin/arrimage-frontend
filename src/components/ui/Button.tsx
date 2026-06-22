/**
 * @file    Button.tsx
 * @module  components/ui
 */

import { cn } from '@/utils/cn';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-cnss-primary text-white hover:bg-cnss-primary-dark disabled:opacity-60 shadow-card',
  secondary: 'bg-white text-cnss-blue border border-cnss-blue hover:bg-cnss-active-nav',
  outline: 'bg-white text-cnss-blue border border-cnss-icon hover:bg-cnss-input-bg',
  ghost: 'bg-transparent text-cnss-text hover:bg-cnss-input-bg',
  danger: 'bg-cnss-error text-white hover:bg-cnss-error-text',
};

export function Button({
  variant = 'primary',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded px-4 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-cnss-primary/30 disabled:cursor-not-allowed',
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
