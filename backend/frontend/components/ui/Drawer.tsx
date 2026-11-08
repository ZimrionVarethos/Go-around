'use client';

import { cn } from '@/lib/cn';
import { X } from 'lucide-react';
import React, { useEffect } from 'react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  overlay?: boolean;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  overlay = false,
}: DrawerProps) {
  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {overlay && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-30 backdrop-blur-2xs transition-opacity"
          aria-hidden="true"
        />
      )}
      <aside
        role="dialog"
        aria-modal={overlay}
        className={cn(
          'absolute top-0 right-0 h-full w-full sm:w-[420px] lg:w-[440px] bg-white z-40 shadow-2xl flex flex-col border-l border-slate-200 transition-transform duration-300 ease-in-out',
          className
        )}
      >
        {/* Header */}
        <div className="h-14 px-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/95 backdrop-blur-xs">
          <div className="font-bold text-slate-900 text-sm truncate pr-2">{title}</div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Tutup panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-slate-100 space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-slate-100 bg-white/95 backdrop-blur-xs shrink-0 shadow-xs">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}
