'use client';

import { useCallback, useRef, useState } from 'react';
import { MapPage } from '@/components/map/MapPage';
import { SearchConnectedTopbar, SearchProvider } from '@/components/search';
import { GoAroundChatbot } from '@/components/chat/GoAroundChatbot';
import { SplashScreen } from './SplashScreen';

export function WebGisExperience() {
  const [dismissed, setDismissed] = useState(false);
  const mapContentRef = useRef<HTMLElement>(null);
  const showSplash = !dismissed;

  const finishSplash = useCallback(() => {
    setDismissed(true);
    requestAnimationFrame(() => mapContentRef.current?.focus({ preventScroll: true }));
  }, []);

  return (
    <>
      <div
        className="h-dvh w-full flex flex-col overflow-hidden select-none"
        inert={showSplash}
        aria-hidden={showSplash || undefined}
      >
        <main
          ref={mapContentRef}
          tabIndex={-1}
          aria-label="Peta tempat nugas di Bogor"
          className="flex-1 w-full relative overflow-hidden"
        >
          <SearchProvider>
            <MapPage locationEnabled={!showSplash} />
            <div className="absolute top-2 sm:top-3.5 left-3 right-3 sm:left-6 sm:right-6 z-[500] pointer-events-auto">
              <SearchConnectedTopbar />
            </div>
            {/* Floating Chatbot Assistant & Buy Me a Coffee in Bottom Right */}
            <GoAroundChatbot />
          </SearchProvider>
        </main>
      </div>
      {showSplash && <SplashScreen onComplete={finishSplash} />}
    </>
  );
}
