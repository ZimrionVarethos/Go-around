import { BadgeCheck, CircleHelp, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface DataConfidenceBadgeProps {
  value: number | null;
  compact?: boolean;
}

export function DataConfidenceBadge({ value, compact = false }: DataConfidenceBadgeProps) {
  if (value === null) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500">
        <CircleHelp className="h-3 w-3" aria-hidden="true" />
        {compact ? 'Belum dinilai' : 'Kualitas data belum dinilai'}
      </span>
    );
  }

  const level = value >= 80 ? 'high' : value >= 55 ? 'medium' : 'low';
  const Icon = level === 'high' ? BadgeCheck : ShieldAlert;
  const label = level === 'high' ? 'Data kuat' : level === 'medium' ? 'Data cukup' : 'Data terbatas';

  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-[10px] font-bold',
      level === 'high' && 'text-emerald-700',
      level === 'medium' && 'text-amber-700',
      level === 'low' && 'text-rose-700',
    )} title={`Confidence ${value}%`}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}{compact ? '' : ` · ${Math.round(value)}%`}
    </span>
  );
}
