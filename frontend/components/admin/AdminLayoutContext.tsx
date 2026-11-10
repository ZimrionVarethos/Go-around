'use client';

import { createContext, useContext } from 'react';

export interface AdminLayoutContextType {
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const AdminLayoutContext = createContext<AdminLayoutContextType>({
  openMobileMenu: () => {},
  closeMobileMenu: () => {},
});

export function useAdminLayout() {
  return useContext(AdminLayoutContext);
}
