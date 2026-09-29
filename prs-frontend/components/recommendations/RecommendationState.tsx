import { AlertTriangle, MapPinned, SearchX } from 'lucide-react';
import { PlaceCardSkeleton } from '@/components/ui/States';

export function RecommendationLoadingState() {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <span className="sr-only">Sedang mencari rekomendasi tempat nugas.</span>
      {Array.from({ length: 3 }).map((_, index) => <PlaceCardSkeleton key={index} />)}
    </div>
  );
}

export function RecommendationEmptyState({ onChangeCriteria }: { onChangeCriteria: () => void }) {
  return (
    <div className="flex flex-col items-center px-5 py-9 text-center">
      <SearchX className="h-7 w-7 text-slate-400" aria-hidden="true" />
      <h3 className="mt-3 text-sm font-bold text-slate-900">Belum ada tempat yang cocok</h3>
      <p className="mt-1 max-w-64 text-xs leading-relaxed text-slate-500">
        Coba tambah radius, naikkan budget, atau kurangi fasilitas wajib.
      </p>
      <button
        type="button"
        onClick={onChangeCriteria}
        className="mt-4 min-h-10 rounded-full px-4 text-xs font-bold text-[#005B54] ring-1 ring-teal-300 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]"
      >
        Ubah kriteria
      </button>
    </div>
  );
}

export function RecommendationErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center px-5 py-9 text-center" role="alert">
      <AlertTriangle className="h-7 w-7 text-rose-600" aria-hidden="true" />
      <h3 className="mt-3 text-sm font-bold text-slate-900">Rekomendasi belum bisa dimuat</h3>
      <p className="mt-1 max-w-64 text-xs leading-relaxed text-slate-500">
        Kriteria kamu tetap tersimpan. Coba hubungkan kembali beberapa saat lagi.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 min-h-10 rounded-full bg-[#005B54] px-4 text-xs font-bold text-white hover:bg-[#004741] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54] focus-visible:ring-offset-2"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}

export function RecommendationIdleState({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center px-5 py-9 text-center">
      <MapPinned className="h-7 w-7 text-[#005B54]" aria-hidden="true" />
      <h3 className="mt-3 text-sm font-bold text-slate-900">Temukan tempat nugas yang pas</h3>
      <p className="mt-1 max-w-64 text-xs leading-relaxed text-slate-500">
        Atur jarak, budget, dan fasilitas yang kamu butuhkan.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-4 min-h-10 rounded-full bg-[#005B54] px-4 text-xs font-bold text-white hover:bg-[#004741] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54] focus-visible:ring-offset-2"
      >
        Atur preferensi
      </button>
    </div>
  );
}
