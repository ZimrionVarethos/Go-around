'use client';

import { useState, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

interface AdminLayoutContextType {
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType>({
  openMobileMenu: () => {},
  closeMobileMenu: () => {},
});

export function useAdminLayout() {
  return useContext(AdminLayoutContext);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close mobile drawer whenever route changes
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  return (
    <AdminLayoutContext.Provider
      value={{
        openMobileMenu: () => setMobileMenuOpen(true),
        closeMobileMenu: () => setMobileMenuOpen(false),
      }}
    >
      <div className="flex h-screen w-screen overflow-hidden bg-surface-subtle font-sans text-text-900 antialiased select-none">
        {/* 1. Desktop Sidebar (md+) */}
        <div className="hidden md:flex shrink-0">
          <AdminSidebar />
        </div>

        {/* 2. Mobile Drawer Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer content */}
            <div className="relative z-10 w-[260px] h-full shadow-2xl animate-in slide-in-from-left duration-200">
              <AdminSidebar onCloseMobile={() => setMobileMenuOpen(false)} className="w-full h-full" />
            </div>
          </div>
        )}

        {/* 3. Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <main
            className="flex-1 overflow-y-auto min-w-0"
            id="admin-content-scroll"
          >
            {children}
          </main>
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}
