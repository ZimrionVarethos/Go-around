'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { useAdminLayout } from '../layout';
import { useAdminStore, AdminTicketItem } from '@/lib/admin-store';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';
import {
  TicketFilterToolbar,
  TicketCardList,
  TicketDetailModal,
  TicketStatusFilter,
} from '@/components/admin/reports';

const CATEGORIES = [
  { id: 'all', label: 'Semua Kategori' },
  { id: 'Colokan Rusak', label: 'Colokan Rusak' },
  { id: 'WiFi Tidak Stabil', label: 'WiFi Tidak Stabil' },
  { id: 'Usulan Spot Nugas Baru', label: 'Usulan Baru' },
  { id: 'Update Jam Operasional', label: 'Jam Buka' },
];

export default function AdminReportsPage() {
  const { openMobileMenu } = useAdminLayout();
  const { toasts, showToast, dismissToast } = useToast();

  const {
    tickets,
    unreadTicketsCount,
    markTicketAsRead,
    markAllTicketsAsRead,
    resolveTicket,
    dismissTicket,
  } = useAdminStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<TicketStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalTicket, setActiveModalTicket] = useState<AdminTicketItem | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Filtering
  const filteredTickets = tickets.filter((t) => {
    const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchStatus = selectedStatus === 'all' || t.status === selectedStatus;
    const matchSearch =
      searchQuery === '' ||
      t.cafeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  const handleResolve = (id: string, cafeName: string) => {
    resolveTicket(id);
    showToast(`Tiket ${id} (${cafeName}) divalidasi selesai.`, 'success', 3000);
    if (activeModalTicket?.id === id) {
      setActiveModalTicket(null);
    }
  };

  const handleDismiss = (id: string) => {
    dismissTicket(id);
    showToast(`Tiket ${id} diabaikan.`, 'info', 2500);
    if (activeModalTicket?.id === id) {
      setActiveModalTicket(null);
    }
  };

  const handleSaveNote = () => {
    if (!activeModalTicket) return;
    resolveTicket(activeModalTicket.id, noteInput);
    showToast('Catatan internal admin disimpan.', 'success', 2500);
    setActiveModalTicket(null);
    setNoteInput('');
  };

  const handleOpenTicketModal = (ticket: AdminTicketItem) => {
    markTicketAsRead(ticket.id);
    setActiveModalTicket(ticket);
    setNoteInput(ticket.internalNote || '');
  };

  return (
    <div className="flex flex-col min-h-full pb-12">
      {/* Topbar */}
      <AdminTopbar
        title="Laporan & Tiket"
        subtitle="Antrean moderasi laporan fasilitas publik dan usulan titik tempat nugas"
        onOpenMobileMenu={openMobileMenu}
        showSearch={false}
        hideDefaultExport={true}
        actions={
          unreadTicketsCount > 0 ? (
            <button
              type="button"
              onClick={() => {
                markAllTicketsAsRead();
                showToast('Semua tiket ditandai sudah dibaca.', 'success', 2500);
              }}
              className="bg-white hover:bg-[#F5F6F3] border border-[#E2E5DF] text-text-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer tactile-press tabular-nums"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Tandai Dibaca ({unreadTicketsCount})</span>
              <span className="sm:hidden">Dibaca</span>
            </button>
          ) : undefined
        }
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Filter Toolbar */}
        <TicketFilterToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={CATEGORIES}
        />

        {/* Tickets Grid / List */}
        <TicketCardList
          tickets={filteredTickets}
          onOpenModal={handleOpenTicketModal}
          onResolve={handleResolve}
          onDismiss={handleDismiss}
        />
      </div>

      {/* Modal Detail & Catatan Internal */}
      <TicketDetailModal
        ticket={activeModalTicket}
        noteInput={noteInput}
        setNoteInput={setNoteInput}
        onClose={() => setActiveModalTicket(null)}
        onSaveNote={handleSaveNote}
      />

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
