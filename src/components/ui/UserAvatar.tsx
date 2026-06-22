/**
 * @file    UserAvatar.tsx
 * @module  components/ui
 */

import { cn } from '@/utils/cn';
import { getUserInitials } from '@/utils/roleLabels';

interface UserAvatarProps {
  prenom: string;
  nom: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function UserAvatar({ prenom, nom, className, size = 'md' }: UserAvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-cnss-avatar font-bold text-cnss-blue',
        size === 'sm' ? 'h-8 w-8 text-xs' : 'h-9 w-9 text-sm',
        className,
      )}
    >
      {getUserInitials(prenom, nom)}
    </span>
  );
}
