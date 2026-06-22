/**
 * @file    DataTable.tsx
 * @module  components/ui
 */

import { cn } from '@/utils/cn';

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div className={cn('overflow-x-auto rounded border border-cnss-border bg-white shadow-card', className)}>
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
}

export function DataTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-cnss-border bg-cnss-input-bg">
      {children}
    </thead>
  );
}

export function DataTableHeaderCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        'px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted',
        className,
      )}
    >
      {children}
    </th>
  );
}

export function DataTableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-cnss-border">{children}</tbody>;
}

export function DataTableRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr className={cn('transition-colors hover:bg-cnss-input-bg/50', className)}>
      {children}
    </tr>
  );
}

export function DataTableCell({
  children,
  className,
  colSpan,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  title?: string;
}) {
  return (
    <td colSpan={colSpan} title={title} className={cn('px-6 py-4 text-cnss-text', className)}>
      {children}
    </td>
  );
}
