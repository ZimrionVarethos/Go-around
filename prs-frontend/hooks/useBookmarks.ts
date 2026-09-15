'use client';

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'go-around:bookmarks';

/**
 * localStorage-backed bookmark state.
 * Toggle a place slug in/out of the bookmarks set.
 * 
 * TODO [BACKEND]: Replace localStorage with API:
 *   POST /api/v1/users/me/bookmarks { place_slug }
 *   DELETE /api/v1/users/me/bookmarks/:slug
 *   GET /api/v1/users/me/bookmarks
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(new Set(JSON.parse(stored) as string[]));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const toggleBookmark = useCallback((slug: string): boolean => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      // Persist
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
    // Return whether it was added (true) or removed (false)
    return !bookmarks.has(slug);
  }, [bookmarks]);

  const isBookmarked = useCallback((slug: string) => bookmarks.has(slug), [bookmarks]);

  return { bookmarks, toggleBookmark, isBookmarked };
}
