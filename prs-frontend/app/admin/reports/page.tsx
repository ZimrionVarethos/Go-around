'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
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
    addTicket,
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
      t.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  const handleResolve = (id: string, cafeName: string) => {
    resolveTicket(id);
    showToast(`Tiket ${id} untuk ${cafeName} berhasil diselesaikan! 🚀`, 'success', 3000);
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
    showToast('Catatan internal admin berhasil disimpan! 📝', 'success', 2500);
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
        title="Report & Tiket Validasi"
        subtitle="Kelola laporan fasilitas mahasiswa dan usulan spot nugas baru"
        onOpenMobileMenu={openMobileMenu}
        actions={
          <div className="flex items-center gap-2">
            {unreadTicketsCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  markAllTicketsAsRead();
                  showToast('Semua tiket telah ditandai sudah dibaca 👍', 'success', 2500);
                }}
                className="bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Tandai Sudah Dibaca ({unreadTicketsCount})</span>
                <span className="sm:hidden">Tandai Dibaca</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                addTicket({
                  category: 'Colokan Rusak',
                  cafeName: 'Janji Jiwa Pajajaran',
                  description: 'Colokan di meja area tengah banyak yang mati total saat jam nugas.',
                  reportedBy: 'Mahasiswa IPB (Baru)',
                });
                showToast('Tiket laporan baru masuk! Badge navbar diperbarui 🔔', 'info', 3000);
              }}
              className="bg-[#005B54] hover:bg-[#004741] active:bg-[#003d38] text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulasi Laporan</span>
              <span className="sm:hidden">Laporan</span>
            </button>
          </div>
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
