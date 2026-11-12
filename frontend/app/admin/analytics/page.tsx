'use client';

import { useState } from 'react';
import { DownloadSimpleIcon } from '@phosphor-icons/react';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { useAdminLayout } from '@/components/admin/AdminLayoutContext';
import { refreshAnalyticsFromApi, useAdminStore } from '@/lib/admin-store';
import { adminAnalyticsApi, getAdminToken, shouldUseLaravelAdminApi } from '@/lib/api-admin';
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
  const { analytics } = useAdminStore();

  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const handleTimeRangeChange = (nextRange: TimeRange) => {
    setTimeRange(nextRange);
    void refreshAnalyticsFromApi(nextRange);
  };

  const handleExport = async () => {
    if (shouldUseLaravelAdminApi()) {
      try {
        const token = getAdminToken();
        const res = await fetch(adminAnalyticsApi.exportGeoJSONUrl(), {
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `goaround_analytics_${timeRange}_${new Date().toISOString().slice(0, 10)}.geojson`;
          link.click();
          URL.revokeObjectURL(url);
          showToast('Laporan analisis & dataset GeoJSON diekspor dari backend.', 'success', 3000);
          return;
        }
      } catch {
        // Fallback below
      }
    }
    showToast('Laporan analisis spasial diekspor (CSV & GeoJSON).', 'success', 3000);
  };

  return (
    <div className="flex flex-col min-h-full pb-12">
      <AdminTopbar
        title="Analisis Spasial"
        subtitle="Distribusi kueri wilayah, pola waktu kunjungan, dan preferensi fasilitas mahasiswa"
        onOpenMobileMenu={openMobileMenu}
        showSearch={false}
        actions={
          <button
            type="button"
            onClick={handleExport}
            className="bg-white hover:bg-[#F5F6F3] border border-[#E2E5DF] text-text-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs tactile-press"
          >
            <DownloadSimpleIcon size={14} weight="bold" className="text-text-500" />
            <span className="hidden sm:inline">Ekspor Analisis</span>
            <span className="sm:hidden">Ekspor</span>
          </button>
        }
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Time Filter Toolbar */}
        <AnalyticsFilterToolbar timeRange={timeRange} setTimeRange={handleTimeRangeChange} />

        {/* 4 KPI Metrics */}
        <AnalyticsKPIGrid kpi={analytics.kpi} />

        {/* 2-Column: Preferences & Peak Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudentPreferencesSection preferences={analytics.preferences} />
          <PeakHoursChart peakHours={analytics.peakHours} />
        </div>

        {/* 2-Column: Spatial Density & Top Cafes */}
        <SpatialZonesSection
          spatialDensity={analytics.spatialDensity}
          topCafes={analytics.topCafes}
        />
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
