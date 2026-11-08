'use client';

import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { useAdminLayout } from './layout';
import { MOCK_KPI } from '@/lib/admin-mock-data';
import { useAdminStore } from '@/lib/admin-store';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';
import {
  AdminWelcomeBanner,
  AdminKPICards,
  RecentTicketsSection,
  TopPlacesSection,
} from '@/components/admin/dashboard';

export default function AdminDashboardPage() {
  const { openMobileMenu } = useAdminLayout();
  const { toasts, showToast, dismissToast } = useToast();

  const { tickets, places, resolveTicket, dismissTicket } = useAdminStore();

  const handleResolveTicket = (ticketId: string, cafeName: string) => {
    resolveTicket(ticketId);
    showToast(`Tiket ${ticketId} (${cafeName}) ditandai selesai! ✅`, 'success', 3000);
  };

  const handleDismissTicket = (ticketId: string) => {
    dismissTicket(ticketId);
    showToast(`Tiket ${ticketId} diabaikan`, 'info', 2500);
  };

  const activeTickets = tickets.filter((t) => t.status === 'open');

  return (
    <div className="flex flex-col min-h-full pb-12">
      {/* Admin Header */}
      <AdminTopbar
        title="Dashboard Overview"
        subtitle="Pemantauan master data spasial, tiket laporan, dan aktivitas nugas mahasiswa"
        onOpenMobileMenu={openMobileMenu}
        showSearch={false}
        hideDefaultExport={true}
      />

      {/* Main Container */}
      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Welcome Banner */}
        <AdminWelcomeBanner activeTicketsCount={activeTickets.length} />

        {/* 4 KPI Grid Cards */}
        <AdminKPICards
          totalPlaces={places.length}
          activeTicketsCount={activeTickets.length}
          kpi={MOCK_KPI}
        />

        {/* 2-Column Section: Recent Tickets & Top Cafes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentTicketsSection
            tickets={tickets}
            onResolve={handleResolveTicket}
            onDismiss={handleDismissTicket}
          />
          <TopPlacesSection places={places} />
        </div>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
