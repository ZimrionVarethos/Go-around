'use client';

import {
  PlugChargingIcon,
  PlugIcon,
  WifiHighIcon,
  WifiMediumIcon,
  WifiLowIcon,
  WifiSlashIcon,
  HeadphonesIcon,
  SpeakerSimpleLowIcon,
  SpeakerSimpleHighIcon,
} from '@phosphor-icons/react';
import type { IconWeight } from '@phosphor-icons/react';
import { cn } from '@/lib/cn';
import type { NoiseLevel, PlugAvailability, WifiQuality } from '@/lib/types';

export interface DynamicWifiIconProps {
  mbps?: number | null;
  speedMbps?: number | null;
  quality?: WifiQuality | null;
  size?: number | string;
  weight?: IconWeight;
  className?: string;
  colored?: boolean;
}

export function DynamicWifiIcon({
  mbps,
  speedMbps,
  quality,
  size = 16,
  weight = 'bold',
  className,
  colored = true,
}: DynamicWifiIconProps) {
  const effectiveMbps = mbps !== undefined ? mbps : speedMbps;

  // Determine tier from Mbps first, then fallback to quality enum
  const isNullOrZero =
    (effectiveMbps === null || effectiveMbps === undefined || effectiveMbps <= 0) && !quality;

  if (isNullOrZero) {
    return (
      <WifiSlashIcon
        size={size}
        weight="regular"
        className={cn(colored && 'text-slate-400', className)}
        aria-hidden="true"
      />
    );
  }

  const isHigh =
    (typeof effectiveMbps === 'number' && effectiveMbps >= 50) ||
    quality === 'fast' ||
    quality === 'ultra';

  const isMedium =
    !isHigh &&
    ((typeof effectiveMbps === 'number' && effectiveMbps >= 25) || quality === 'medium');

  if (isHigh) {
    return (
      <WifiHighIcon
        size={size}
        weight={weight}
        className={cn(colored && 'text-emerald-600', className)}
        aria-hidden="true"
      />
    );
  }

  if (isMedium) {
    return (
      <WifiMediumIcon
        size={size}
        weight={weight}
        className={cn(colored && 'text-amber-600', className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <WifiLowIcon
      size={size}
      weight={weight}
      className={cn(colored && 'text-rose-600', className)}
      aria-hidden="true"
    />
  );
}

export interface DynamicPlugIconProps {
  plugPercent?: number | null;
  percent?: number | null;
  availability?: PlugAvailability | null;
  size?: number | string;
  weight?: IconWeight;
  className?: string;
  colored?: boolean;
}

export function DynamicPlugIcon({
  plugPercent,
  percent,
  availability,
  size = 16,
  weight = 'duotone',
  className,
  colored = true,
}: DynamicPlugIconProps) {
  const effectivePercent = plugPercent !== undefined ? plugPercent : percent;
  const isAbundant =
    (typeof effectivePercent === 'number' && effectivePercent >= 80) ||
    availability === 'abundant';

  const isModerate =
    !isAbundant &&
    ((typeof effectivePercent === 'number' && effectivePercent >= 50) ||
      availability === 'moderate');

  if (isAbundant) {
    return (
      <PlugChargingIcon
        size={size}
        weight={weight}
        className={cn(colored && 'text-[#005B54]', className)}
        aria-hidden="true"
      />
    );
  }

  if (isModerate) {
    return (
      <PlugChargingIcon
        size={size}
        weight="regular"
        className={cn(colored && 'text-amber-600', className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <PlugIcon
      size={size}
      weight="regular"
      className={cn(colored && 'text-rose-500', className)}
      aria-hidden="true"
    />
  );
}

export interface DynamicAcousticIconProps {
  noiseLevel?: NoiseLevel | null;
  acousticLabel?: string | null;
  size?: number | string;
  weight?: IconWeight;
  className?: string;
  colored?: boolean;
}

export function DynamicAcousticIcon({
  noiseLevel,
  acousticLabel,
  size = 16,
  weight = 'duotone',
  className,
  colored = true,
}: DynamicAcousticIconProps) {
  const lower = (acousticLabel || '').toLowerCase();
  const isQuiet =
    noiseLevel === 'quiet' ||
    lower.includes('tenang') ||
    lower.includes('hening') ||
    lower.includes('silent') ||
    lower.includes('sejuk');

  const isLively = noiseLevel === 'lively' || lower.includes('ramai');

  if (isQuiet) {
    return (
      <HeadphonesIcon
        size={size}
        weight={weight}
        className={cn(colored && 'text-[#005B54]', className)}
        aria-hidden="true"
      />
    );
  }

  if (isLively) {
    return (
      <SpeakerSimpleHighIcon
        size={size}
        weight={weight}
        className={cn(colored && 'text-amber-600', className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <SpeakerSimpleLowIcon
      size={size}
      weight={weight}
      className={cn(colored && 'text-sky-600', className)}
      aria-hidden="true"
    />
  );
}
