# NASIR Dashboard Design Pattern & System Architecture

Dokumen ini mendokumentasikan pola desain (design pattern), sistem visual, palet warna, tipografi, geometri bentuk, tata letak spasial, serta efek animasi mikro yang diterapkan pada antarmuka dashboard **NASIR (Nusantara Asset Integrity and Risk)**. Panduan ini disusun untuk mempermudah replikasi dan *recall* estetika modern industrial dark-mode pada proyek mendatang.

---

## 1. Filosofi Desain (Design Philosophy)

* **Tema Utama**: *Modern Industrial Dark Obsidian* (Futuristik, bersih, presisi tinggi, dan minim distraksi visual).
* **Fokus Pengguna**: Pemantauan telemetri teknik industri yang bersifat *mission-critical* (risiko struktur, korosi, kebocoran, dan emisi metana).
* **Prinsip Utama**:
  1. **Visual Hierarchy yang Tegas**: Elemen paling berisiko atau paling mendesak menggunakan warna aksen terang (*high-contrast neon/pastel*), sementara data statis dan label menggunakan warna abu-abu netral teredam (*muted slate*).
  2. **Micro-Interaction on Demand**: Informasi status atau label kategori tersembunyi secara kompak dan bergeser secara mulus (*smooth reveal*) hanya ketika elemen di-hover secara spesifik.
  3. **Data Density yang Nyaman**: Menggabungkan angka KPI ringkas, grafik batang berbentuk pil (*pill bars*), kurva spline lembut (*continuous area*), dan visual 3D digital twin interaktif.

---

## 2. Palet Warna & Token Desain (Color Tokens)

Sistem warna dibangun di atas basis *deep charcoal/slate* dengan kontras aksen yang cerah namun elegan:

### A. Latar Belakang & Permukaan (Foundation)
| Nama Token | Nilai Hex | Penggunaan |
| :--- | :--- | :--- |
| `--color-nasir-bg` | `#171821` | Kanvas latar belakang utama halaman, body, dan area canvas 3D |
| `--color-nasir-surface` | `#21222D` | Latar belakang kartu (*card surface*), kontainer panel, popover |
| `--color-nasir-border` | `#2B2B36` | Garis batas (*border*) kartu, pemisah tabel, dan garis grid chart |
| `--nested-surface` | `#171821` (alpha 60%) | Latar sub-kartu atau item di dalam kartu utama |

### B. Hierarki Teks (Typography Colors)
| Level | Nilai Hex | Karakteristik |
| :--- | :--- | :--- |
| **Heading / Value Utama** | `#FFFFFF` | Kontras 100%, font tebal (600-700), tajam |
| **Body / Readout Text** | `#C5C7D0` | Abu-abu cerah, nyaman dibaca untuk tabel dan deskripsi |
| **Secondary / Label / Subtitle** | `#8C8D99` | Netral teredam, ukuran 10-12px, cocok untuk konteks/satuan |
| **Muted / Decorative** | `#606170` | Informasi pelengkap yang tidak memerlukan atensi utama |

### C. Warna Aksen & Status Risiko (Status & Accents)
| Status / Indikator | Nilai Hex | Warna | Konteks Penerapan |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `#A9DFD8` | Mint Soft Cyan | Tombol aktif, status "Dibuka / Draft", tautan navigasi |
| **Warning / Activity** | `#FEB95A` | Amber Gold | Aktivitas korosi, status "Sedang / Berjalan", sorotan KPI |
| **Telemetry / Signal** | `#20AEF3` | Electric Sky Blue | Sensor konsentrasi metana (ppm), indikator sinyal telemetri |
| **Deviation / Pressure** | `#F2C8ED` | Soft Lavender Pink | Deviasi tekanan flensa, kurva sekunder |
| **Success / Low Risk** | `#4ADE80` | Emerald Green | Tier Rendah (<25), status "Selesai / Sesuai", kondisi aman |
| **Danger / High Risk** | `#F87171` | Soft Rose Red | Tier Tinggi (50-74), peringatan bahaya |
| **Critical Risk** | `#FB7185` | Vivid Coral Rose | Tier Kritis (≥75), anomali kebocoran parah |

---

## 3. Tipografi (Typography Hierarchy)

Sistem menggunakan font geometris kontemporer untuk estetika modern:

1. **Font UI Utama (`font-sans`)**: **`Onest`** (Google Fonts / Fontsource)
   * Alternatif: `Inter`, `Plus Jakarta Sans`, atau `Geist Sans`.
   * Karakter: Geometris, sudut membulat halus, legibilitas sangat tinggi di ukuran kecil (10-13px).
   * Bobot: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold).

2. **Font Kode & Telemetri (`font-code`, `font-metric`)**: **`Commit Mono`** atau **`Chivo Mono`**
   * Digunakan untuk: Kode aset (misal: `FL-PR-01`), angka metrik skor (`72/100`), pembacaan sensor (`148 ppm`), persentase, dan tanggal.
   * Alasan: Monospace tabular memastikan angka tidak bergeser saat data ter-refresh secara dinamis.

---

## 4. Bentuk, Geometri & Penataan Komponen (Layout & Geometry)

### A. Geometri Bentuk (Border Radius & Spacing)
* **Main Cards**: `rounded-xl` (12px) dengan `border border-[#2B2B36]` dan `p-4` s.d. `p-5`.
* **Sub-items / Action Buttons**: `rounded-lg` (8px) dengan transisi halus (`transition duration-200`).
* **Pill Badges & Tabs**: `rounded-full` atau `rounded-lg` dengan padding ringkas (`px-2.5 py-0.5`).
* **Chart Bars**: `radius={[6, 6, 6, 6]}` atau `radius={[8, 8, 8, 8]}` sehingga ujung batang membulat simetris menyerupai pil kapsul modern.

### B. Hierarki Penataan Halaman (12-Column Grid Flow)
Dashboard dirancang mengalir dari indikator global hingga detail operasional lapangan:

```
+-------------------------------------------------------------------------+
| HEADER: Judul Fasilitas, Kode Tag, & Segmented Toggle (7 Hari / 30 Hari)|
+-------------------------------------------------------------------------+
| ROW 1 (4 Kolom KPI):                                                    |
| [ Total Aset ]  [ Aset Prioritas Tinggi ] [ Massa Metana ] [ Draf Lap ] |
+-------------------------------------------------------------------------+
| ROW 2 (8 + 4 Kolom):                                                    |
| [ Hero Chart: Spline Area / Bar Toggle ] (8 cols) | [ Draf Dokumen ](4c)|
+-------------------------------------------------------------------------+
| ROW 2.5 (3 Kolom Trio Pill Bar Telemetri):                              |
| [ Aktivitas Korosi (Gold) ] [ Deviasi Tekanan (Pink) ] [ Sinyal CH4(Blue)|
+-------------------------------------------------------------------------+
| ROW 3 (8 + 4 Kolom Operasional):                                        |
| [ Tabel Aset Prioritas Triase ] (8 cols)          | [ Tugas Perbaikan ] |
+-------------------------------------------------------------------------+
```

1. **Top Header**: Penegasan konteks fasilitas dan *Segmented Switch* bergaya pill (`bg-[#21222D]` dengan border `#2B2B36`, tombol aktif `bg-[#A9DFD8] text-[#171821]`).
2. **KPI Metrics Grid (Row 1)**: 4 kartu metrik dengan icon monokromatik di sudut, angka tebal 24-28px, dan indikator highlight jika nilai berisiko.
3. **Primary Analytic vs Documentation (Row 2)**: 8 kolom untuk area chart laju emisi kontinu (monotone spline) dengan *toggle switcher* cepat ke diagram batang distribusi tier. 4 kolom untuk draf laporan dengan progress bar kelengkapan data.
4. **Trio Pill Bar Telemetry (Row 2.5)**: 3 kartu mini horizontal berjejer dengan diagram batang tipis berketinggian ringkas (`h-20`), warna tematik spesifik (Gold, Pink, Electric Blue) yang menampilkan sub-skor fisik.
5. **Operational Action Grid (Row 3)**: 8 kolom tabel aset dengan skor triase bergradien, dan 4 kolom daftar tiket pemeliharaan dengan nama penanggung jawab (PIC).

---

## 5. Pola Animasi & Interaksi Mikro (Micro-Interactions)

Bagian paling khas dari gaya desain NASIR adalah animasi interaksi yang responsif:

### A. Animasi Slider Bar Kiri-ke-Kanan (Status Slider Block)
Saat kursor mouse menyentuh baris item tugas atau laporan, muncul sapuan latar belakang gradien dari kiri ke kanan secara mulus disertai garis aksen vertikal di sebelah kiri:

```css
/* Efek Hover Slider dari Sisi Kiri */
.status-row-selesai,
.status-row-berjalan,
.status-row-dibuka,
.status-row-batal,
.status-row-revisi {
    border-left: 4px solid transparent;
    background-position: left center;
    background-repeat: no-repeat;
    background-size: 0% 100%;
    transition: background-size 0.38s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease;
}

/* Transisi Halus Saat Mouse Keluar */
.status-row-selesai:not(:hover),
.status-row-berjalan:not(:hover),
.status-row-dibuka:not(:hover) {
    transition: background-size 0.28s ease-out, border-color 0.2s ease;
}

/* Variasi Warna Gradien Berdasarkan Status */
.status-row-selesai {
    background-image: linear-gradient(to right, rgba(74, 222, 128, 0.25) 0%, rgba(74, 222, 128, 0.10) 60%, rgba(74, 222, 128, 0.04) 100%);
}
.status-row-selesai:hover {
    border-left-color: #4ADE80;
    background-size: 100% 100%;
}

.status-row-berjalan {
    background-image: linear-gradient(to right, rgba(254, 185, 90, 0.25) 0%, rgba(254, 185, 90, 0.10) 60%, rgba(254, 185, 90, 0.04) 100%);
}
.status-row-berjalan:hover {
    border-left-color: #FEB95A;
    background-size: 100% 100%;
}

.status-row-dibuka {
    background-image: linear-gradient(to right, rgba(169, 223, 216, 0.25) 0%, rgba(169, 223, 216, 0.10) 60%, rgba(169, 223, 216, 0.04) 100%);
}
.status-row-dibuka:hover {
    border-left-color: #A9DFD8;
    background-size: 100% 100%;
}
```

### B. Animasi Label Tersembunyi (Inline Label Reveal)
Saat baris tabel di-hover, teks kategori (misal: "kritis", "tinggi", "berjalan") yang tadinya tersembunyi dengan lebar 0 akan mengembang ke samping (*expand horizontally*) dan mendorong teks di sebelahnya secara mulus:

```css
/* Label Tag Tersembunyi */
.tier-reveal-label {
    display: inline-block;
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    white-space: nowrap;
    transform: translateX(-8px);
    transition: max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.25s ease,
                transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                margin 0.35s ease;
    margin-right: 0;
    font-family: var(--font-sans);
    font-weight: 700;
    text-transform: lowercase;
    color: #C5C7D0;
    vertical-align: middle;
}

/* Muncul Saat Baris Di-Hover */
.tier-row-kritis:hover .tier-reveal-label,
.tier-row-tinggi:hover .tier-reveal-label,
.tier-row-sedang:hover .tier-reveal-label,
.tier-row-rendah:hover .tier-reveal-label {
    max-width: 80px;
    opacity: 1;
    transform: translateX(0);
    margin-right: 8px;
}
```

### C. Kurva Recharts Spline & Custom Tooltip Popover
Grafik laju emisi menggunakan kurva kubik monoton (*Monotone Cubic Spline*) yang dilengkapi gradien area di bawah garis kurva:

```tsx
<AreaChart data={trendData}>
    <defs>
        <linearGradient id="emissionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#A9DFD8" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#A9DFD8" stopOpacity={0.0} />
        </linearGradient>
    </defs>
    <Area
        type="monotone"
        dataKey="rate"
        stroke="#A9DFD8"
        strokeWidth={2.5}
        fill="url(#emissionGradient)"
    />
</AreaChart>
```

Tooltip popover menggunakan latar gelap solid `#171821` berbatas `#2B2B36` dengan font metrik sehingga konsisten dengan kartu lainnya.

---

## 6. Integrasi Visual 3D Digital Twin (Three.js & Fiber)

Scene 3D diintegrasikan langsung pada kartu dashboard atau halaman inspektur aset:

* **Pustaka**: `@react-three/fiber` dan `@react-three/drei`.
* **Pencahayaan Tanpa Aset Berat**: Menggunakan `RoomEnvironment` dan `PMREMGenerator` prosedural bawaan Three.js untuk menghasilkan pantulan permukaan logam fisik (*metalness & roughness*) tanpa perlu mengunduh file HDRI megabita tinggi:
  ```ts
  const pmremGenerator = new THREE.PMREMGenerator(gl);
  pmremGenerator.compileEquirectangularShader();
  const roomEnv = new RoomEnvironment();
  scene.environment = pmremGenerator.fromScene(roomEnv).texture;
  ```
* **Pulsing Sensor Node**: Indikator titik inspeksi sensor 3D menggunakan fungsi sinusoidal waktu pada `useFrame`:
  ```ts
  useFrame((state) => {
      const t = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(t * 3.5) * 0.22;
      sensorRef.current.scale.set(scale, scale, scale);
  });
  ```
* **Bayangan Kontak Realistis**: Menggunakan `<ContactShadows position={[0, -0.4, 0]} opacity={0.65} scale={10} blur={2.5} far={4} />` untuk memberikan bobot nyata pada objek 3D di atas kanvas gelap `#171821`.

---

## 7. Custom Scrollbar Standar Industri

Agar jendela tabel dan daftar panjang tidak dirusak oleh scrollbar bawaan sistem operasi yang cerah, scrollbar kustom disematkan pada stylesheet global:

```css
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #171821;
}

::-webkit-scrollbar-thumb {
    background: #2B2B36;
    border-radius: 9999px;
    border: 2px solid #171821;
}

::-webkit-scrollbar-thumb:hover {
    background: #8C8D99;
}
```

---

## 8. Ringkasan Singkat Penerapan (Quick Recipe)

Saat ingin membuat komponen kartu baru dengan gaya desain ini:
1. Bungkus kartu dengan kelas: `rounded-xl border border-[#2B2B36] bg-[#21222D] p-5 shadow-sm`.
2. Gunakan `#FFFFFF` untuk judul utama, `#8C8D99` untuk teks panduan/satuan, dan `#C5C7D0` untuk isi data.
3. Untuk item yang dapat diklik atau memiliki status, beri kelas `bg-[#171821]/60 border border-[#2B2B36] rounded-lg` dan sematkan kelas status animasi (`status-row-...` atau `tier-row-...`).
4. Pasang warna aksen mint `#A9DFD8` untuk elemen interaktif primer, amber `#FEB95A` untuk peringatan perhatian, dan sky blue `#20AEF3` untuk data sensorik.
