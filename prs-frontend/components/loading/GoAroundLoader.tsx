import styles from './GoAroundLoader.module.css';

interface GoAroundLoaderProps {
  mode?: 'page' | 'map';
  label?: string;
}

export function GoAroundLoader({
  mode = 'page',
  label = 'Menyiapkan perjalananmu…',
}: GoAroundLoaderProps) {
  return (
    <div
      className={mode === 'page' ? styles.page : styles.map}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className={styles.content}>
        <p className={styles.brand} aria-hidden="true">
          Go Around<span />
        </p>
        <div className={styles.route} aria-hidden="true">
          <span className={styles.start} />
          <span className={styles.traveler} />
          <span className={styles.destination} />
        </div>
        <p className={styles.label}>{label}</p>
      </div>
    </div>
  );
}
