import { PublicTopbar } from '@/components/layout/PublicTopbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { MapPage } from '@/features/map';

export default function WebGisPage() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden select-none">
      {/* Interactive WebGIS Map Canvas & Floating Overlays */}
      <main className="flex-1 w-full relative overflow-hidden">
        <MapPage />

        {/* Floating Top Navbar Header */}
        <div className="absolute top-2 sm:top-3.5 left-3 right-3 sm:left-6 sm:right-6 z-[500] pointer-events-auto">
          <PublicTopbar />
        </div>
      </main>

      {/* Global Public Footer */}
      <PublicFooter />
    </div>
  );
}
