'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { useAdminLayout } from '../layout';
import { MOCK_ANALYTICS } from '@/lib/admin-mock-data';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';
import {
  AnalyticsFilterToolbar,
  AnalyticsKPIGrid,
  StudentPreferencesSection,
  PeakHoursChart,
  SpatialZonesSection,
  TimeRange,
} from '@/components/admin/analytics';

export default function AdminAnalyticsPage() {
  const { openMobileMenu } = useAdminLayout();
  const { toasts, showToast, dismissToast } = useToast();

  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const handleExport = () => {
    showToast('Laporan analisis spasial berhasil diekspor (CSV & PDF)! 📊', 'success', 3000);
  };

  return (
    <div className="flex flex-col min-h-full pb-12">
      <AdminTopbar
        title="Analisis Pengguna & Spasial"
        subtitle="Wawasan preferensi mahasiswa, jam sibuk nugas, dan distribusi spasial Kota Bogor"
        onOpenMobileMenu={openMobileMenu}
        actions={
          <button
            type="button"
            onClick={handleExport}
            className="bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ekspor Laporan</span>
            <span className="sm:hidden">Ekspor</span>
          </button>
        }
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Time Filter Toolbar */}
        <AnalyticsFilterToolbar timeRange={timeRange} setTimeRange={setTimeRange} />

        {/* 4 KPI Metrics */}
        <AnalyticsKPIGrid kpi={MOCK_ANALYTICS.kpi} />

        {/* 2-Column: Preferences & Peak Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudentPreferencesSection preferences={MOCK_ANALYTICS.preferences} />
          <PeakHoursChart peakHours={MOCK_ANALYTICS.peakHours} />
        </div>

        {/* 2-Column: Spatial Density & Top Cafes */}
        <SpatialZonesSection
          spatialDensity={MOCK_ANALYTICS.spatialDensity}
          topCafes={MOCK_ANALYTICS.topCafes}
        />
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
