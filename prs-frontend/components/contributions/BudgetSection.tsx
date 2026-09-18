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
    <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
      {/* Header with Step 3 Circle */}
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
          3
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            Estimasi Budget Ramah Kantong Mahasiswa
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Transparansi harga untuk menjaga dompet mahasiswa tetap aman
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Kopi Termurah */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">
            Kopi Termurah (Rp) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
              Rp
            </span>
            <input
              type="text"
              value={priceMinDrink}
              onChange={(e) => onPriceMinDrinkChange(e.target.value)}
              placeholder="18.000"
              className="w-full h-11 pl-10 pr-3.5 text-xs bg-white border border-gray-200 rounded-[10px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all"
            />
          </div>
          <p className="text-[10.5px] text-gray-400">Misal: Es Kopi Susu Aren / Teh</p>
        </div>

        {/* Rata-rata Harga */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">
            Rata-rata Harga
          </label>
          <select
            value={priceAvgTier}
            onChange={(e) => onPriceAvgTierChange(e.target.value)}
            className="w-full h-11 px-3 text-xs bg-white border border-gray-200 rounded-[10px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] cursor-pointer"
          >
            <option value="< Rp 25.000">&lt; Rp 25.000</option>
            <option value="Rp 25.000 - Rp 35.000">Rp 25.000 - Rp 35.000</option>
            <option value="> Rp 35.000">&gt; Rp 35.000</option>
          </select>
          <p className="text-[10.5px] text-gray-400">Rata-rata 1 Minuman + 1 Camilan</p>
        </div>

        {/* Tarif Parkir Motor */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">
            Tarif Parkir Motor
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
              Rp
            </span>
            <input
              type="text"
              value={parkingFeeMotor}
              onChange={(e) => onParkingFeeMotorChange(e.target.value)}
              placeholder="2.000"
              className="w-full h-11 pl-10 pr-3.5 text-xs bg-white border border-gray-200 rounded-[10px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all"
            />
          </div>
          <p className="text-[10.5px] text-gray-400">Standar resmi Kota Bogor / Bebas Parkir</p>
        </div>
      </div>
    </section>
  );
}
