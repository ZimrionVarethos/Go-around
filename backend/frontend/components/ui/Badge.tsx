import { cn } from '@/lib/cn';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'star'
  | 'teal'
  | 'gis-ideal'
  | 'gis-good'
  | 'gis-fair'
  | 'gis-poor';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-surface-header text-text-700 border-border-strong',
  success: 'bg-success-bg text-success-base border-success-border',
  warning: 'bg-warning-bg text-warning-base border-warning-border',
  danger: 'bg-danger-bg text-danger-base border-danger-border',
  info: 'bg-info-bg text-info-base border-info-border',
  purple: 'bg-purple-bg text-purple-base border-purple-border',
  star: 'bg-[#FFFBEB] text-star border-[#FDE68A]',
  teal: 'bg-primary-900 text-white border-transparent',
  'gis-ideal': 'bg-emerald-50 text-gis-ideal border-emerald-200',
  'gis-good': 'bg-emerald-50/60 text-gis-good border-emerald-200/60',
  'gis-fair': 'bg-amber-50 text-gis-fair border-amber-200',
  'gis-poor': 'bg-red-50 text-gis-poor border-red-200',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className,
}: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] leading-tight',
    md: 'px-2.5 py-1 text-xs leading-normal',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border shrink-0',
        variants[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// Status pill — maps string status to variant and Indonesian label automatically
export type StatusType =
  | 'verified'
  | 'terverifikasi'
  | 'review'
  | 'perlu_review'
  | 'audit'
  | 'butuh_audit'
  | 'pending'
  | 'inactive'
  | 'tidak_aktif'
  | string;

export function StatusPill({
  status,
  className,
}: {
  status: StatusType;
  className?: string;
}) {
  const normalized = status?.toLowerCase();

  let variant: BadgeVariant = 'default';
  let label = status;

  if (normalized === 'verified' || normalized === 'terverifikasi' || normalized === 'active') {
    variant = 'success';
    label = 'Terverifikasi';
  } else if (normalized === 'review' || normalized === 'perlu_review' || normalized === 'perlu review') {
    variant = 'warning';
    label = 'Perlu Review';
  } else if (normalized === 'audit' || normalized === 'butuh_audit' || normalized === 'butuh audit') {
    variant = 'warning';
    label = 'Butuh Audit';
  } else if (normalized === 'pending') {
    variant = 'default';
    label = 'Pending';
  } else if (normalized === 'inactive' || normalized === 'tidak_aktif') {
    variant = 'default';
    label = 'Tidak Aktif';
  }

  return (
    <Badge variant={variant} className={cn('font-semibold', className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      {label}
    </Badge>
  );
}
