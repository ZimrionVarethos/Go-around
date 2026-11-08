'use client';

export interface BudgetSectionProps {
  priceMinDrink: string;
  onPriceMinDrinkChange: (val: string) => void;
  priceAvgTier: string;
  onPriceAvgTierChange: (val: string) => void;
  parkingFeeMotor: string;
  onParkingFeeMotorChange: (val: string) => void;
}

export function BudgetSection({
  priceMinDrink,
  onPriceMinDrinkChange,
  priceAvgTier,
  onPriceAvgTierChange,
  parkingFeeMotor,
  onParkingFeeMotorChange,
}: BudgetSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 sm:p-8 space-y-6">
      {/* Header with Step 3 Circle */}
      <div className="flex items-start gap-3.5 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          3
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Estimasi Bujet Ramah Kantong Mahasiswa
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Transparansi perkiraan harga untuk menjaga pengeluaran harian mahasiswa tetap hemat
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Kopi Termurah */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900 block">
            Harga Minuman Termurah (Rp) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">
              Rp
            </span>
            <input
              type="text"
              value={priceMinDrink}
              onChange={(e) => onPriceMinDrinkChange(e.target.value)}
              placeholder="Cth: 18.000"
              className="w-full h-12 pl-12 pr-4 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all"
            />
          </div>
          <p className="text-xs text-gray-400">Contoh: Es Kopi Susu Aren / Teh Manis</p>
        </div>

        {/* Rata-rata Harga */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900 block">
            Rata-rata Pengeluaran Nugas
          </label>
          <select
            value={priceAvgTier}
            onChange={(e) => onPriceAvgTierChange(e.target.value)}
            className="w-full h-12 px-3.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] cursor-pointer"
          >
            <option value="< Rp 25.000">&lt; Rp 25.000 (Hemat Pelajar)</option>
            <option value="Rp 25.000 - Rp 35.000">Rp 25.000 - Rp 35.000 (Standar Kafe)</option>
            <option value="> Rp 35.000">&gt; Rp 35.000 (Spesialti Premium)</option>
          </select>
          <p className="text-xs text-gray-400">Estimasi 1 Minuman + 1 Camilan</p>
        </div>

        {/* Tarif Parkir Motor */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900 block">
            Tarif Parkir Motor
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">
              Rp
            </span>
            <input
              type="text"
              value={parkingFeeMotor}
              onChange={(e) => onParkingFeeMotorChange(e.target.value)}
              placeholder="Cth: 2.000"
              className="w-full h-12 pl-12 pr-4 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all"
            />
          </div>
          <p className="text-xs text-gray-400">Tarif standar resmi Kota Bogor (Isi 0 jika gratis)</p>
        </div>
      </div>
    </section>
  );
}
