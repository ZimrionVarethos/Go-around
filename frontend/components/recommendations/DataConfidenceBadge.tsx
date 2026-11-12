'use client';

import {
  QuestionIcon,
  SealCheckIcon,
  ShieldWarningIcon,
} from '@phosphor-icons/react';
import { cn } from '@/lib/cn';

export interface DataConfidenceBadgeProps {
  value: number | null;
  compact?: boolean;
}

export function DataConfidenceBadge({ value, compact = false }: DataConfidenceBadgeProps) {
  if (value === null) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500">
        <QuestionIcon size={12} weight="bold" aria-hidden="true" />
        {compact ? 'Belum dinilai' : 'Kualitas data belum dinilai'}
      </span>
    );
  }

  const level = value >= 80 ? 'high' : value >= 55 ? 'medium' : 'low';
  const Icon = level === 'high' ? SealCheckIcon : ShieldWarningIcon;
  const label = level === 'high' ? 'Data kuat' : level === 'medium' ? 'Data cukup' : 'Data terbatas';

  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-[10px] font-bold',
      level === 'high' && 'text-emerald-700',
      level === 'medium' && 'text-amber-700',
      level === 'low' && 'text-rose-700',
    )} title={`Confidence ${value}%`}>
      <Icon size={12} weight="fill" aria-hidden="true" />
      {label}{compact ? '' : ` · ${Math.round(value)}%`}
    </span>
  );
}
