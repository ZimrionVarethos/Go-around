import { cn } from '@/lib/cn';
import { AlertTriangle, FolderOpen } from 'lucide-react';
import React from 'react';

// Generic Skeleton element
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-border-subtle/80',
        className
      )}
    />
  );
}

// Skeleton card (for place card shape)
export function PlaceCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl border border-border-subtle bg-white space-y-3 shadow-xs">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-8 w-full rounded-full" />
    </div>
  );
}

// Skeleton table row (for admin data table)
export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="border-b border-border-subtle">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

// Empty state
export function EmptyState({
  icon = <FolderOpen className="w-6 h-6" />,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12 px-6 text-center', className)}>
      <div className="w-12 h-12 rounded-full bg-surface-header flex items-center justify-center text-text-400">
        {icon}
      </div>
      <p className="text-sm font-semibold text-text-900">{title}</p>
      {description && <p className="text-xs text-text-500 max-w-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// Error state
export function ErrorState({
  message = 'Gagal memuat data dari server',
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12 px-6 text-center', className)}>
      <div className="w-12 h-12 rounded-full bg-danger-bg flex items-center justify-center text-danger-base">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <p className="text-sm font-semibold text-text-900">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-primary-900 hover:text-primary-800 underline font-medium cursor-pointer"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}
