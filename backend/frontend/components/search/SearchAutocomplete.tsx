'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  LoaderCircle,
  MapPin,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { cn } from '@/lib/cn';
import type {
  PlaceSearchSuggestion,
  SearchSuggestion,
  SearchSuggestionMode,
} from '@/lib/search';

export interface SearchAutocompleteProps {
  mode: SearchSuggestionMode;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onPlaceSelect?: (place: PlaceSearchSuggestion) => void;
  placeholder: string;
  autoFocus?: boolean;
  className?: string;
  tone?: 'plain' | 'need';
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const normalizedQuery = query.trim().toLocaleLowerCase('id-ID');
  const index = text.toLocaleLowerCase('id-ID').indexOf(normalizedQuery);

  if (!normalizedQuery || index < 0) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-transparent font-extrabold text-[#005B54]">
        {text.slice(index, index + normalizedQuery.length)}
      </mark>
      {text.slice(index + normalizedQuery.length)}
    </>
  );
}

export function SearchAutocomplete({
  mode,
  value,
  onChange,
  onSubmit,
  onPlaceSelect,
  placeholder,
  autoFocus = false,
  className,
  tone = 'plain',
}: SearchAutocompleteProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const trimmedValue = value.trim();
  const canQuery = mode === 'need' || trimmedValue.length >= 2;
  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useSearchSuggestions(mode, value, isOpen);
  const suggestions: SearchSuggestion[] = data?.data ?? [];
  const showPanel = isOpen && canQuery;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const chooseSuggestion = (suggestion: SearchSuggestion) => {
    setIsOpen(false);
    setActiveIndex(-1);

    if (suggestion.kind === 'place') {
      onChange(suggestion.name);
      onPlaceSelect?.(suggestion);
      return;
    }

    onChange(suggestion.text);
    onSubmit(suggestion.text);
  };

  const submitValue = () => {
    if (!trimmedValue) return;
    setIsOpen(false);
    onSubmit(trimmedValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && suggestions.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % suggestions.length);
      return;
    }

    if (event.key === 'ArrowUp' && suggestions.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => current <= 0 ? suggestions.length - 1 : current - 1);
      return;
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      chooseSuggestion(suggestions[activeIndex]);
    }
  };

  return (
    <form
      ref={containerRef}
      onSubmit={(event) => {
        event.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          chooseSuggestion(suggestions[activeIndex]);
          return;
        }
        submitValue();
      }}
      className={cn('relative h-10', className)}
      role="search"
    >
      <div
        className={cn(
          'flex h-full items-center rounded-xl bg-white border transition-all',
          tone === 'need'
            ? 'bg-[#F4FAF8] border-[#005B54]/25 hover:border-[#005B54]/50 focus-within:border-[#005B54] focus-within:ring-2 focus-within:ring-[#005B54]/15 focus-within:bg-white'
            : 'border-slate-200/90 hover:border-slate-300 focus-within:border-[#005B54] focus-within:ring-2 focus-within:ring-[#005B54]/15',
        )}
      >
        {tone === 'need' ? (
          <Sparkles className="ml-3 h-4 w-4 shrink-0 text-[#005B54]" aria-hidden="true" />
        ) : (
          <Search className="ml-3 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
        )}
        <input
          type="search"
          value={value}
          autoFocus={autoFocus}
          onChange={(event) => {
            onChange(event.target.value);
            setActiveIndex(-1);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent px-2 text-xs font-medium text-slate-900 caret-[#005B54] outline-none placeholder:text-slate-500 [&::-webkit-search-cancel-button]:hidden"
        />
        {(isLoading || isFetching) && (
          <LoaderCircle className="mr-2 h-3.5 w-3.5 shrink-0 animate-spin text-[#005B54]" aria-label="Memuat saran" />
        )}
        {value && !(isLoading || isFetching) && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setActiveIndex(-1);
              setIsOpen(true);
            }}
            className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]"
            aria-label="Hapus pencarian"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
        {value && (
          <button
            type="submit"
            className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#005B54] text-white hover:bg-[#004741] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54] focus-visible:ring-offset-1"
            aria-label={mode === 'place' ? 'Cari tempat' : 'Cari berdasarkan kebutuhan'}
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {showPanel && (
        <div className="absolute left-0 right-0 top-12 z-[80] overflow-hidden rounded-2xl bg-white shadow-[0_18px_42px_-18px_rgba(15,23,42,0.55)] ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2.5">
            <p className="text-[11px] font-extrabold text-slate-800">
              {mode === 'place' ? 'Coffee shop yang cocok' : 'Saran kebutuhan'}
            </p>
            {data?.meta.source === 'mock' && (
              <span className="text-[10px] font-semibold text-slate-500">Data contoh</span>
            )}
          </div>

          <div id={listboxId} role="listbox" className="max-h-72 overflow-y-auto py-1.5">
            {isError ? (
              <div className="flex items-start gap-2.5 px-3.5 py-4 text-xs text-amber-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Saran belum dapat dimuat. Kamu tetap bisa menekan Enter untuk mencari.</span>
              </div>
            ) : !isLoading && !isFetching && suggestions.length === 0 ? (
              <div className="px-3.5 py-4 text-xs leading-relaxed text-slate-600">
                {mode === 'place'
                  ? `Belum ada coffee shop yang cocok dengan “${trimmedValue}”.`
                  : 'Lanjutkan menulis kebutuhanmu, lalu tekan Enter untuk mencari.'}
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.kind === 'place' ? suggestion.id : suggestion.id}
                  id={`${listboxId}-${index}`}
                  type="button"
                  role="option"
                  aria-selected={activeIndex === index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => chooseSuggestion(suggestion)}
                  className={cn(
                    'flex w-full items-start gap-3 px-3.5 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#005B54]',
                    activeIndex === index ? 'bg-[#EDF8F6]' : 'hover:bg-slate-50',
                  )}
                >
                  <span className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    suggestion.kind === 'place'
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-[#E8F8F5] text-[#005B54]',
                  )}>
                    {suggestion.kind === 'place' ? (
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-bold text-slate-900">
                      <HighlightedText
                        text={suggestion.kind === 'place' ? suggestion.name : suggestion.text}
                        query={trimmedValue}
                      />
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                      {suggestion.kind === 'place'
                        ? `${suggestion.subdistrict} · ${suggestion.address}`
                        : suggestion.hint}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>

          <p className="border-t border-slate-100 px-3.5 py-2 text-[10px] text-slate-500">
            Gunakan ↑ ↓ untuk memilih, lalu Enter untuk membuka hasil.
          </p>
        </div>
      )}
    </form>
  );
}
