'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { GoAroundLoader } from './GoAroundLoader';
import styles from './NavigationFeedback.module.css';

const MIN_VISIBLE_MS = 420;
const SAFETY_TIMEOUT_MS = 6000;

function getLocationKey(url: URL) {
  return `${url.pathname}${url.search}`;
}

export function NavigationFeedback() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locationKey = `${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`;
  const currentLocationRef = useRef(locationKey);
  const destinationRef = useRef<string | null>(null);
  const startedAtRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const clearTimers = () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };

    const beginNavigation = (destination: string) => {
      if (destination === currentLocationRef.current) return;

      clearTimers();
      const destPath = destination.split('?')[0];
      const currentPath = currentLocationRef.current.split('?')[0];
      if (
        destPath === '/' ||
        destPath.startsWith('/admin') ||
        currentPath.startsWith('/admin')
      ) {
        destinationRef.current = null;
        setVisible(false);
        return;
      }

      destinationRef.current = destination;
      startedAtRef.current = performance.now();
      setVisible(true);
      safetyTimerRef.current = setTimeout(() => {
        destinationRef.current = null;
        setVisible(false);
      }, SAFETY_TIMEOUT_MS);
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const destinationUrl = new URL(anchor.href, window.location.href);
      if (destinationUrl.origin !== window.location.origin) return;

      const destination = getLocationKey(destinationUrl);
      const current = getLocationKey(new URL(window.location.href));
      if (destination === current) return;

      beginNavigation(destination);
    };

    const handlePopState = () => {
      beginNavigation(getLocationKey(new URL(window.location.href)));
    };

    document.addEventListener('click', handleDocumentClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('popstate', handlePopState);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    currentLocationRef.current = locationKey;
    if (!visible || destinationRef.current !== locationKey) return;

    const elapsed = performance.now() - startedAtRef.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      destinationRef.current = null;
      setVisible(false);
    }, remaining);
  }, [locationKey, visible]);

  if (!visible || pathname.startsWith('/admin')) return null;

  return (
    <div className={styles.overlay} aria-busy="true">
      <GoAroundLoader label="Membuka halaman…" />
    </div>
  );
}
