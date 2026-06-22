/**
 * @file    PageHeader.tsx
 * @module  components/ui
 */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type BreadcrumbItem = string | { label: string; to: string };

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  breadcrumb?: BreadcrumbItem[];
}

function breadcrumbLabel(item: BreadcrumbItem): string {
  return typeof item === 'string' ? item : item.label;
}

export function PageHeader({ title, subtitle, action, breadcrumb }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-2 flex items-center gap-2 text-sm text-cnss-text">
            {breadcrumb.map((item, i) => {
              const label = breadcrumbLabel(item);
              const to = typeof item === 'string' ? undefined : item.to;
              const isLast = i === breadcrumb.length - 1;

              return (
                <span key={`${label}-${i}`} className="flex items-center gap-2">
                  {i > 0 && <span className="text-cnss-icon">/</span>}
                  {to && !isLast ? (
                    <Link to={to} className="hover:text-cnss-primary hover:underline">
                      {label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'font-bold text-cnss-blue' : ''}>{label}</span>
                  )}
                </span>
              );
            })}
          </nav>
        )}
        <h1 className="text-2xl font-bold text-cnss-blue">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-cnss-text">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
