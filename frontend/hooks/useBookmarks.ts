'use client';

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'go-around:bookmarks';
const BOOKMARK_EVENT = 'go-around:bookmarks';
const EMPTY_BOOKMARKS = new Set<string>();

let cachedRaw: string | null = null;
let cachedSet: Set<string> = EMPTY_BOOKMARKS;

function readBookmarksSnapshot(): Set<string> {
  if (typeof window === 'undefined') return EMPTY_BOOKMARKS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cachedRaw = null;
      cachedSet = EMPTY_BOOKMARKS;
      return EMPTY_BOOKMARKS;
    }
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSet = new Set(JSON.parse(raw) as string[]);
    }
    return cachedSet;
  } catch {
    return EMPTY_BOOKMARKS;
  }
}

function getServerSnapshot(): Set<string> {
  return EMPTY_BOOKMARKS;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handleChange = () => callback();
  window.addEventListener('storage', handleChange);
  window.addEventListener(BOOKMARK_EVENT, handleChange);
  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener(BOOKMARK_EVENT, handleChange);
  };
}

/**
 * localStorage-backed bookmark state.
 * Toggle a place slug in/out of the bookmarks set.
 */
export function useBookmarks() {
  const bookmarks = useSyncExternalStore(
    subscribe,
    readBookmarksSnapshot,
    getServerSnapshot,
  );

  const toggleBookmark = useCallback((slug: string): boolean => {
    const current = readBookmarksSnapshot();
    const next = new Set(current);
    let added = false;
    if (next.has(slug)) {
      next.delete(slug);
    } else {
      next.add(slug);
      added = true;
    }
    try {
      const serialized = JSON.stringify(Array.from(next));
      cachedRaw = serialized;
      cachedSet = next;
      window.localStorage.setItem(STORAGE_KEY, serialized);
      window.dispatchEvent(new Event(BOOKMARK_EVENT));
    } catch {
      // Ignore storage errors
    }
    return added;
  }, []);

  const isBookmarked = useCallback((slug: string) => bookmarks.has(slug), [bookmarks]);

  return { bookmarks, toggleBookmark, isBookmarked };
}
