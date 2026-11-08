/**
 * Minimal cn() utility — merges class names.
 * Kept simple: no clsx or tailwind-merge dep needed for this project size.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
