'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './SplashScreen.module.css';

const JOURNEY_MS = 4200;
const EXIT_MS = 280;
const IMAGE_WAIT_MS = 1200;

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [started, setStarted] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [exiting, setExiting] = useState(false);
  const skipRef = useRef<HTMLButtonElement>(null);
  const startJourney = useCallback(() => setStarted(true), []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Move keyboard focus onto the only available action while the map is inert.
    skipRef.current?.focus({ preventScroll: true });
    const imageFallback = window.setTimeout(startJourney, IMAGE_WAIT_MS);
    const reducedMotionTimer = motion.matches ? window.setTimeout(onComplete, 200) : undefined;
    const onMotionChange = () => {
      if (motion.matches) onComplete();
    };
    motion.addEventListener('change', onMotionChange);
    return () => {
      clearTimeout(imageFallback);
      clearTimeout(reducedMotionTimer);
      motion.removeEventListener('change', onMotionChange);
    };
  }, [onComplete, startJourney]);

  useEffect(() => {
    if (!started) return;
    const arrival = window.setTimeout(() => setArrived(true), JOURNEY_MS * 0.8);
    const exit = window.setTimeout(() => setExiting(true), JOURNEY_MS);
    // A timer also dismisses the overlay if CSS animation events never arrive.
    const complete = window.setTimeout(onComplete, JOURNEY_MS + EXIT_MS);
    return () => {
      clearTimeout(arrival);
      clearTimeout(exit);
      clearTimeout(complete);
    };
  }, [started, onComplete]);

  return (
    <section
      className={styles.screen}
      data-running={started}
      data-exiting={exiting}
      aria-label="Selamat datang di Go Around"
      style={{ '--journey-duration': `${JOURNEY_MS}ms`, '--exit-duration': `${EXIT_MS}ms` } as CSSProperties}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onComplete();
      }}
    >
      <header className={styles.topbar}>
        <span className={styles.location}><span aria-hidden="true" />Bogor, Jawa Barat</span>
        <button ref={skipRef} className={styles.skip} type="button" onClick={onComplete}>
          Lewati
          <span className="sr-only"> animasi dan buka peta</span>
        </button>
      </header>

      <div className={styles.composition}>
        <div className={styles.heading}>
          <h1>Go Around<span className={styles.wordDot} aria-hidden="true" /></h1>
          <p>{arrived ? 'Tempat nugasmu, tinggal pilih.' : 'Nugasnya di mana? Kita cari bareng.'}</p>
        </div>

        <div className={styles.scene} aria-hidden="true">
          <div className={styles.land}>
            {[0, 1, 2, 3].map((hill) => <span className={styles.hill} key={hill} />)}
          </div>
          <div className={styles.town}>
            {[0, 1, 2, 3].map((building) => <span className={styles.building} key={building} />)}
            {[0, 1, 2].map((tree) => <span className={styles.tree} key={`tree-${tree}`} />)}
          </div>
          <div className={styles.road}><div className={styles.roadDashes} /></div>
          <div className={styles.destination}>
            <span className={styles.pin} />
            <span className={styles.destinationLabel}>Spot nugasmu</span>
          </div>
          <div className={styles.bike}>
            <div className={styles.riders}>
              <Image
                src="/images/splash/go-around-riders.webp"
                width={768}
                height={512}
                alt=""
                loading="eager"
                fetchPriority="high"
                unoptimized
                draggable={false}
                onLoad={startJourney}
                onError={startJourney}
              />
            </div>
          </div>
        </div>
        <span className={styles.finishLine} aria-hidden="true" />
      </div>

      <footer className={styles.footer}>
        <div className={styles.route} aria-hidden="true"><span className={styles.routeFill} /></div>
        <div className={styles.footerCopy}>
          <p role="status">{arrived ? 'Yuk, mulai jelajah.' : 'Lagi jalan ke spot nugasmu…'}</p>
          <span>Temukan tempat. Buat cerita.</span>
        </div>
      </footer>
    </section>
  );
}
