# Go Around — Design Tokens Specification (Revisi Komprehensif)

> **Versi**: 2.0 (Revisi Komprehensif)  
> **Cakupan**: Seluruh antarmuka **Public WebGIS** (Peta Interaktif, Rekomendasi AI, Drawer Detail & List, Form Usulan/Lapor) dan **Admin Backoffice** (Dashboard Overview, Kelola Kafe & Direktori Spasial PostGIS, Tiket Laporan & Validasi Fasilitas, Analisis Pengguna & Preferensi Mahasiswa).  
> **Referensi Sumber**: UI Mockup & Figma Reference (`figma-screens-mcp.md`), Screens Implementasi, dan `api-contract.md`.

---

## 1. Fondasi Warna (Color Palette & Semantic Tokens)

Sistem warna menggunakan tema **Forest Teal & Emerald Green** sebagai warna identitas spasial dan ramah mahasiswa, dipadukan dengan aksen fungsional untuk visualisasi status validasi, kecepatan Wi-Fi, ketersediaan colokan, dan level kebisingan akustik.

### 1.1 Primary Brand (Teal & Emerald)
Warna inti untuk identitas brand, button CTA utama, active navigation, dan highlight fitur spasial.

| Token CSS | Nilai Hex | RGB / HSL | Penggunaan |
|---|---|---|---|
| `--color-primary-950` | `#003833` | `rgb(0, 56, 51)` | Header gelap, high contrast text |
| `--color-primary-900` | `#005B54` | `rgb(0, 91, 84)` | **Brand Primary Utama**: Button CTA, active sidebar item, heading aksen |
| `--color-primary-800` | `#096E66` | `rgb(9, 110, 102)` | State hover pada tombol CTA primer |
| `--color-primary-700` | `#0F756E` | `rgb(15, 117, 110)` | Border highlight, ikon primer, sub-heading teal |
| `--color-primary-600` | `#0D8A78` | `rgb(13, 138, 120)` | Interactive links, secondary state |
| `--color-primary-500` | `#059669` | `rgb(5, 150, 105)` | **Verified Green**: Badge status "Terverifikasi", skor tinggi nugas |
| `--color-primary-400` | `#10B981` | `rgb(16, 185, 129)` | Mint green: Polygon isochrone GIS, chart highlight |
| `--color-primary-300` | `#6EE7B7` | `rgb(110, 231, 183)` | Border alert sukses, ring focus soft |
| `--color-primary-200` | `#A7F3D0` | `rgb(167, 243, 208)` | Border badge verified, outline chip aktif |
| `--color-primary-100` | `#E6F7EF` | `rgb(230, 247, 239)` | Background badge verified, active filter pill |
| `--color-primary-50`  | `#EFFBF6` | `rgb(239, 251, 246)` | Background callout box AI Match, container informasi positif |

---

### 1.2 Neutral & Surface Palette
Palet grayscale netral yang dioptimalkan untuk readability data tabel PostGIS dan card dashboard.

| Token CSS | Nilai Hex | Penggunaan |
|---|---|---|
| `--color-text-950` | `#090D14` | Heading display utama, angka metrik KPI |
| `--color-text-900` | `#131A2D` | Text utama, judul tabel, nama kafe |
| `--color-text-700` | `#334155` | Body text, label form, deskripsi laporan |
| `--color-text-500` | `#64748B` | Metadata, caption, timestamp, helper text, shortcut `⌘K` |
| `--color-text-400` | `#94A3B8` | Placeholder input, ikon non-aktif, divider vertikal |
| `--color-border-strong` | `#CBD5E1` | Border input saat hover, divider header |
| `--color-border-subtle` | `#E2E8F0` | Border standar card, table row divider, filter pill border |
| `--color-surface-subtle` | `#F8FAFC` | Background canvas Admin, row hover table, disabled input |
| `--color-surface-header` | `#F1F5F9` | Table header (`<th>`), speedtest preview box, chip netral |
| `--color-surface-white`  | `#FFFFFF` | Background card, modal, sidebar, navbar, popup detail |
| `--color-canvas-map`     | `#F6F4ED` | Background basemap fallback & layout WebGIS publik |

---

### 1.3 Semantic & Status Colors
Digunakan untuk status tayang direktori kafe, prioritas tiket laporan, dan skor fasilitas.

| Status / Fasilitas | Base Hex | Background Pill | Border Pill | Penggunaan |
|---|---|---|---|---|
| **Success / Terverifikasi** | `#059669` | `#E6F7EF` | `#A7F3D0` | Status tayang "Terverifikasi", tombol lolos kurasi |
| **Warning / Perlu Audit** | `#D97706` | `#FEF3C7` | `#FDE68A` | Status "Perlu Review", "Butuh Audit", tiket sedang |
| **Danger / Urgent / Laporan** | `#DC2626` | `#FEE2E2` | `#FECACA` | Tiket "Prioritas Tinggi", tombol hapus/tolak, tombol "Lapor" |
| **Info / Wi-Fi & PostGIS** | `#0284C7` | `#E0F2FE` | `#BAE6FD` | Pill Wi-Fi Speed (Mbps), PostGIS sync indicator |
| **Purple / Usulan Baru** | `#7C3AED` | `#EDE9FE` | `#DDD6FE` | Kategori tiket "Usulan Titik Baru", tag mahasiswa |
| **Star / Rating Kenyamanan** | `#F59E0B` | `#FFFBEB` | `#FDE68A` | Ikon bintang rating nugas (misal: `9.1 / 10`) |
| **Coffee CTA Accent** | `#FACC15` | `#FEF08A` | `#EAB308` | Tombol donasi/support riset "Buy me a coffee" |

---

### 1.4 WebGIS & Kartografi Spatial Tokens
Khusus layer peta Leaflet/Mapbox, isochrone walkability, dan range skor kesesuaian.

| Elemen GIS | Token CSS | Nilai Warna / Styling |
|---|---|---|
| **Skor 0.9 – 1.0 (Sangat Ideal)** | `--gis-score-ideal` | `#059569` (Hijau Emerald Tua) |
| **Skor 0.8 – 0.89 (Bagus)** | `--gis-score-good` | `#10B981` (Hijau Mint Terang) |
| **Skor 0.6 – 0.79 (Cukup)** | `--gis-score-fair` | `#F59E0B` (Kuning-Oranye Amber) |
| **Skor < 0.6 (Kurang Kondusif)** | `--gis-score-poor` | `#EF4444` (Merah Coral) |
| **Buffer Radius Kampus (Fill)** | `--gis-buffer-fill` | `rgba(16, 185, 129, 0.14)` |
| **Buffer Radius Kampus (Stroke)** | `--gis-buffer-stroke` | `rgba(5, 150, 105, 0.60)` (1.5px dashed) |
| **Radius Isochrone Nugas (300m)** | `--gis-isochrone-walk` | `rgba(14, 165, 233, 0.18)` |
| **Pin Marker Terverifikasi** | `--gis-marker-verified` | `#005B54` dengan dot putih & badge skor nugas |
| **Pin Marker Perlu Audit** | `--gis-marker-audit` | `#D97706` dengan icon exclamation |
| **Pin Marker User Location** | `--gis-marker-user` | `#2563EB` dengan pulsing radar wave effect |
| **CRS PostGIS Pill Badge** | `--gis-crs-pill` | Background `#F1F5F9`, Text `#475569`, Border `#CBD5E1` |

---

## 2. Tipografi (Typography Scale & Hierarchy)

Menggunakan font modern sans-serif (**Inter** atau **Plus Jakarta Sans**) dengan monospace font (**JetBrains Mono**) untuk koordinat spasial PostGIS dan kode referensi.

### 2.1 Font Family
- **Brand Logo / Wordmark ("Go Around")**: `'Onest', sans-serif`
  - Font Weight: `500` (Medium)
  - Font Size: `24px` (`1.5rem`)
  - Line Height: `Auto` (sekitar `31px` / `1.3`)
  - Letter Spacing: `-0.72px` (`-0.03em`)
  - Color Fill: `#0F172A`
  - Penggunaan: Khusus untuk identitas brand/logo teks `"Go Around"` di Topbar WebGIS Publik dan Header/Sidebar Admin.
- **Sans (UI & Konten Utama)**: `'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Mono (Spasial PostGIS & Code)**: `'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace`

### 2.2 Scale & Hierarchy

| Token CSS | Ukuran (px / rem) | Line Height | Font Weight | Penggunaan |
|---|---|---|---|---|
| `--font-brand-logo` | `24px` (`1.5rem`) | `Auto` | `500` (Medium) | **Logo Brand "Go Around"** (Font: Onest, letter-spacing: `-0.72px`, color: `#0F172A`) |
| `--font-display` | `32px` (`2.0rem`) | `1.2` (`38px`) | `700` (Bold) | Nilai metrik besar KPI (misal: `28.450`, `108`) |
| `--font-h1` | `24px` (`1.5rem`) | `1.3` (`32px`) | `700` (Bold) | Header halaman Admin, Nama Kafe di Hero Detail |
| `--font-h2` | `20px` (`1.25rem`) | `1.4` (`28px`) | `600` (Semibold) | Header section ("Kelola Kafe", "Analisis Pengguna") |
| `--font-h3` | `16px` (`1.0rem`) | `1.4` (`22px`) | `600` (Semibold) | Sub-header card, nama kafe di list/tabel |
| `--font-body-lg` | `15px` (`0.9375rem`) | `1.5` (`22px`) | `400` / `500` | Teks kutipan AI Spatial Match, deskripsi ringkas |
| `--font-body` | `14px` (`0.875rem`) | `1.5` (`20px`) | `400` (Regular) | Body text, data cell tabel, form inputs |
| `--font-caption` | `12px` (`0.75rem`) | `1.4` (`16px`) | `500` (Medium) | Tag alamat, status tiket, label jam operasional |
| `--font-micro` | `11px` (`0.6875rem`) | `1.3` (`14px`) | `600` (Semibold) | ID Tiket `#TK-802`, ID Kafe `#KF-001`, shortcut `⌘K` |

---

## 3. Sistem Spacing & Grid (Spacing Tokens)

Berbasis sistem **4px / 8px incremental scale**:

| Token CSS | Nilai px | Nilai rem | Penggunaan Tipikal |
|---|---|---|---|
| `--space-0-5` | `2px` | `0.125rem` | Border offset, micro gap badge |
| `--space-1` | `4px` | `0.25rem` | Gap icon-to-text kecil, tag spacing |
| `--space-2` | `8px` | `0.5rem` | Gap antar badge, padding pill filter, button sm |
| `--space-3` | `12px` | `0.75rem` | Padding input standar, gap antar button |
| `--space-4` | `16px` | `1.0rem` | Padding card dalam, jarak antar cell tabel horizontal |
| `--space-5` | `20px` | `1.25rem` | Padding luar widget analitik, gutter antar kolom |
| `--space-6` | `24px` | `1.5rem` | Padding utama panel, padding header tabel |
| `--space-8` | `32px` | `2.0rem` | Jarak antar section besar di dashboard |
| `--space-10` | `40px` | `2.5rem` | Margin kontainer halaman utama |
| `--space-12` | `48px` | `3.0rem` | Top offset drawer WebGIS |

---

## 4. Border Radius Tokens

UI Go Around mengadopsi gaya modern rounded yang ramah pengguna, mulai dari kontainer hingga floating chips.

| Token CSS | Nilai | Penggunaan |
|---|---|---|
| `--radius-xs` | `4px` | Tag kode `#KF-001`, shortcut badge `⌘K` |
| `--radius-sm` | `6px` | Tombol aksi kecil (edit/zoom pada tabel), progress bar |
| `--radius-md` | `8px` | Input search bar, dropdown select filter |
| `--radius-lg` | `12px` | Card KPI statistik, tiket card laporan, speedtest box |
| `--radius-xl` | `16px` | Container tabel master, panel widget analitik, preview mini-map |
| `--radius-2xl` | `20px` | Floating recommendation card WebGIS, drawer modal detail kafe |
| `--radius-full` | `9999px` | Filter pills, status tayang badge, avatar bulat, button pill |

---

## 5. Elevasi & Bayangan (Elevation & Shadows)

Bayangan dibuat lembut (*soft elevation*) dengan tint natural slate agar peta spasial tetap kontras dan nyaman dibaca.

| Token CSS | Nilai CSS Shadow | Penggunaan |
|---|---|---|
| `--shadow-none` | `none` | Flat input, static table rows |
| `--shadow-xs` | `0 1px 2px 0 rgba(16, 24, 40, 0.05)` | Bordered filter pill saat default |
| `--shadow-sm` | `0 1px 3px 0 rgba(16, 24, 40, 0.10), 0 1px 2px -1px rgba(16, 24, 40, 0.10)` | Button sekunder, card stat default |
| `--shadow-md` | `0 4px 6px -1px rgba(16, 24, 40, 0.08), 0 2px 4px -2px rgba(16, 24, 40, 0.04)` | Card stat hover, dropdown menu, popover legend |
| `--shadow-lg` | `0 10px 15px -3px rgba(16, 24, 40, 0.08), 0 4px 6px -4px rgba(16, 24, 40, 0.03)` | Floating search bar WebGIS, detail drawer |
| `--shadow-floating` | `0 20px 25px -5px rgba(0, 77, 64, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.06)` | Modal dialog tambah kafe, batch action floating bar |

---

## 6. Spesifikasi Komponen (Component System Specs)

### 6.1 Admin Layout & Sidebar Navigasi
- **Brand Wordmark Logo**: Teks `"Go Around"` di bagian atas sidebar menggunakan font **`Onest Medium` (500)**, ukuran `24px`, letter-spacing `-0.72px`, warna `#0F172A`.
- **Lebar Sidebar**: `240px` (Desktop).
- **Background**: `#FFFFFF`, Border-Right: `1px solid var(--color-border-subtle)`.
- **Navigasi Item Default**: Text `#64748B`, Icon `#94A3B8`, Padding `10px 16px`, Radius `8px`.
- **Navigasi Item Active**: Background `#E6F7EF`, Text `#005B54` (Font Semibold), Border-Left: `3px solid #005B54`.
- **Counter Badge Navigasi**: Background `#FEE2E2` (misal tiket: `8 baru` warna teks `#DC2626`) atau `#F1F5F9` (`108 titik`).
- **Footer Sidebar**: Link `Lihat WebGIS Publik` dengan icon external-link, dan User Profile ("Azqilla Simbolon / Admin") dengan avatar bulat `36px`.

### 6.2 Header & Topbar Action
- **Tinggi Header**: `64px` - `72px`.
- **Brand Logo (WebGIS Topbar)**: Teks `"Go Around"` menggunakan font **`Onest Medium` (500)**, ukuran `24px`, letter-spacing `-0.72px`, warna `#0F172A`.
- **Global Search Input**: 
  - Background `#FFFFFF` (Admin) / `#FFFFFF` floating (WebGIS).
  - Border `1px solid var(--color-border-subtle)`.
  - Placeholder: `"Cari nama kafe, nama jalan (mis. Pajajaran, Cihuleut), atau ID spasial..."`.
  - Keyboard shortcut badge di ujung kanan: `⌘K` (`font-mono`, background `#F1F5F9`, border `#CBD5E1`).
- **Action Buttons**:
  - Tombol Primer `+ Tambah Data Kafe` / `+ Tambah Tempat`: Background `var(--color-primary-900)`, Text `#FFFFFF`, Icon Plus.
  - Tombol Ekspor `Ekspor GIS` / `Ekspor PDF/CSV`: Background `#FFFFFF`, Border `1px solid var(--color-border-subtle)`, Text `#334155`.
  - Notification Bell: Badge counter merah bulat `16px`.

### 6.3 KPI / Stat Summary Cards
- **Grid Layout**: 4 Kolom responsif (`grid-template-columns: repeat(4, 1fr)`).
- **Struktur Kartu**:
  - Header: Label kartu (`text-xs`, warna `#64748B`) + Ikon di kontainer bulat soft (`36px × 36px`, background `#E6F7EF` atau `#FEF3C7`).
  - Body: Angka statistik besar (`text-display`, warna `#090D14`).
  - Footer / Trend: Persentase tren (`+18% bulan ini` warna hijau `#059669`) dan keterangan perbandingan (`vs 24.110 bulan lalu`).
- **Variasi Kartu Skor Kenyamanan**: Menampilkan nilai `9.1 / 10` dengan badge bintang kuning dan rincian bobot `Metrik: WiFi + Colokan + Akustik (1,840 Review)`.

### 6.4 Filter Bar & Segmented Switcher
- **Dropdown Filter**: Filter Wilayah (`Semua Wilayah Kota Bogor`), Filter Status Tayang (`Semua Status Tayang`).
- **Quick Filter Chips (Pills)**:
  - `WiFi > 50 Mbps` (Icon WiFi, blue/teal accent).
  - `Colokan > 80%` (Icon Plug, amber accent).
  - `Budget < Rp 25k` (Icon Cash, green accent).
  - `Buka 24 Jam` (Icon Clock, purple accent).
  - Active chip state: Background `var(--color-primary-900)`, Text `#FFFFFF`, Icon dismiss `×`.
- **View Switcher (Segmented Control)**:
  - Container abu-abu `#F1F5F9` dengan radius `8px`.
  - Pilihan: `[Tabel]` dan `[Grid Peta]`. Selected item memiliki background `#FFFFFF` dan shadow tipis.

### 6.5 Data Table Direktori Spasial (Kelola Kafe)
- **Table Header**: Background `#F8FAFC`, Text `#475569`, uppercase micro font, padding `12px 16px`.
- **Row Styling**: 
  - Hover: Background `#F8FAFC`.
  - Selected Row: Background `#EFFBF6`.
  - Border bottom: `1px solid #E2E8F0`.
- **Kolom Data Spesifik**:
  - **Kafe & Lokasi Spasial**: Thumbnail gambar `44px × 44px` (radius `8px`), Nama Kafe (`text-body` semibold), ID Tag `#KF-001`, Alamat ringkas dengan pin icon.
  - **Koordinat PostGIS**: Font monospace (misal: `-6.5542, 106.8011`), dilengkapi icon peta kecil untuk zoom-to-point.
  - **WiFi Speed**: Pill biru (`#E0F2FE` bg, `#0284C7` text) dengan angka Mbps tegas (misal: `82 Mbps`).
  - **Colokan Listrik**: Progress bar mini (tinggi `6px`, radius `full`, warna oranye `#F59E0B`) disertai persentase `92%` dan label keterangan (`Hampir tiap meja`).
  - **Kisaran Harga**: Format Rupiah `Rp 28.000+` dengan sub-label kategori (`Ramah Mahasiswa` / `Standar Kafe`).
  - **Akustik & Skor**: Indikator tingkat kebisingan (`Tenang` / `Kondusif` / `Ramai Sore`) + Badge skor bintang (`★ 9.7 / 10 Nugas`).
  - **Status Tayang**: Pill badge hijau (`Terverifikasi`) atau oranye (`Perlu Review` / `Audit`).
  - **Aksi Spasial**: Group icon tombol: Edit pencil, Locate in Map crosshair, Archive/Delete folder.
- **Batch Action Floating Toolbar**:
  - Muncul di bawah saat baris dicentang: Action buttons `Verifikasi Masal`, `Ubah Status`, `Hapus Terpilih`.

### 6.6 Tiket & Moderasi Laporan Fasilitas
- **Severity & Prioritas Kartu**:
  - `Prioritas Tinggi`: Border kiri merah `4px`, chip `! Prioritas Tinggi` (`#FEE2E2` bg, `#DC2626` text).
  - `Prioritas Sedang`: Border kiri oranye `4px`, chip `Prioritas Sedang` (`#FEF3C7` bg, `#D97706` text).
  - `Usulan Baru`: Border kiri teal `4px`, chip `Usulan Spot Nugas Baru` (`#E6F7EF` bg, `#059669` text).
- **Blok Data Speedtest Ookla**:
  - Background `#F0F9FF`, Border `#BAE6FD`, Radius `8px`.
  - Download: `9.2 Mbps`, Upload: `4.1 Mbps`, Ping: `34ms`.
- **Mini-Map Sebaran Tiket Aktif**:
  - Preview Leaflet peta Bogor dengan layer heatmap konsentrasi tiket dan badge CRS `EPSG:4326`.
- **Log Penanganan Terkini (Audit Trail)**:
  - Avatar inisial penangan (misal: `AS` Agung Subekti, `MF` M. Fitrah QA SV IPB, `PostGIS Engine Sync`).
  - Timestamp dan status tindakan verifikasi.

### 6.7 Analisis & Data Visualisasi (Analytics Widgets)
- **Bar Chart Jam Sibuk Nugas**:
  - Bar default: Warna abu-teal `#94A3B8` / `#6EE7B7` dengan rounded top `6px`.
  - Highlight Peak Load: Bar warna teal pekat `#005B54` dengan pill badge `PEAK LOAD 88%` di atasnya (Jam 16.00 - 21.00 WIB).
- **Progress Bar Kebutuhan Fasilitas**:
  - Horizontal bar bertumpuk dengan persentase hits:
    - WiFi Cepat (>50 Mbps): `78%` hits.
    - Banyak Colokan (>80% meja): `68%` hits.
    - Ramah Kantong (< Rp 25.000): `56%` hits.
    - Buka Larut Malam / 24 Jam: `44%` hits.
    - Suasana Tenang / Akustik (<50 dB): `39%` hits.
- **Ranking Spasial Terpadat**:
  - Nomor ranking rounded badge: `#1 Dramaga (IPB University)`, `#2 Bogor Tengah & Taman Kencana`, `#3 Pajajaran & Lodaya`, `#4 Sentul City`.

### 6.8 WebGIS Interaktif & Detail Drawer (User-Facing)
- **AI Spatial Match Banner**:
  - Container rounded `#EFFBF6` dengan border `#A7F3D0`.
  - Match badge: `98% Cocok` dengan sparkle icon.
  - Teks analisis otomatis berdasarkan query mahasiswa (misal: `"colokan tiap meja, wifi kenceng, es kopi murah dekat SV IPB"`).
  - Quick tags: `95% Colokan Meja`, `WiFi 92 Mbps`, `Es Kopi Rp18k`, `4 Mnt dari IPB`.
- **Kartu List Tempat (Left Sidebar)**:
  - Badge Ranking `#1 TOP`, badge skor total `★ 9.7`.
  - 3 Kolom metrik ringkas: `92 Mbps (Kencang)`, `95% Meja (Ada Colokan)`, `42 dB (Tenang Nugas)`.
  - Action button: `Buka Rute Maps` (Hijau teal) & `Detail Fasilitas` (Outline).
- **Floating Map Controls (Right Side)**:
  - Tombol Layer GIS, GPS Geolocation user, Zoom In (+), Zoom Out (-), Compass orientation.
  - Kontainer floating putih dengan shadow `var(--shadow-md)` dan radius `8px`.
- **Floating Legend Peta**:
  - Posisi kanan bawah, box putih dengan list swatches warna skor kesesuaian (`0.9 - 1.0` hijau hingga `< 0.6` merah) dan scale bar `1 Km`.
- **Footer WebGIS**:
  - Status badge: `120+ Lokasi Terverifikasi`.
  - Copyright: `Go Around Bogor © 2026 - Sekolah Vokasi IPB`.
  - Button `Support Riset : Buy me a coffee` (Background kuning `#FACC15`, border `#EAB308`, icon cangkir kopi).

---

## 7. Master CSS Custom Properties (`:root`)

Variabel siap pakai untuk implementasi di CSS, Tailwind CSS config, atau CSS-in-JS:

```css
:root {
  /* --- Primary Brand (Forest Teal & Emerald) --- */
  --color-primary-950: #003833;
  --color-primary-900: #005B54;
  --color-primary-800: #096E66;
  --color-primary-700: #0F756E;
  --color-primary-600: #0D8A78;
  --color-primary-500: #059669;
  --color-primary-400: #10B981;
  --color-primary-300: #6EE7B7;
  --color-primary-200: #A7F3D0;
  --color-primary-100: #E6F7EF;
  --color-primary-50:  #EFFBF6;

  /* --- Neutral & Canvas --- */
  --color-text-950: #090D14;
  --color-text-900: #131A2D;
  --color-text-700: #334155;
  --color-text-500: #64748B;
  --color-text-400: #94A3B8;
  --color-border-strong: #CBD5E1;
  --color-border-subtle: #E2E8F0;
  --color-surface-subtle: #F8FAFC;
  --color-surface-header: #F1F5F9;
  --color-surface-white: #FFFFFF;
  --color-canvas-map: #F6F4ED;

  /* --- Functional & Semantic --- */
  --color-success-base: #059669;
  --color-success-bg: #E6F7EF;
  --color-success-border: #A7F3D0;
  --color-warning-base: #D97706;
  --color-warning-bg: #FEF3C7;
  --color-warning-border: #FDE68A;
  --color-danger-base: #DC2626;
  --color-danger-bg: #FEE2E2;
  --color-danger-border: #FECACA;
  --color-info-base: #0284C7;
  --color-info-bg: #E0F2FE;
  --color-info-border: #BAE6FD;
  --color-purple-base: #7C3AED;
  --color-purple-bg: #EDE9FE;
  --color-purple-border: #DDD6FE;
  --color-star: #F59E0B;
  --color-coffee-cta: #FACC15;

  /* --- WebGIS & Cartography --- */
  --gis-score-ideal: #059569;
  --gis-score-good: #10B981;
  --gis-score-fair: #F59E0B;
  --gis-score-poor: #EF4444;
  --gis-buffer-fill: rgba(16, 185, 129, 0.14);
  --gis-buffer-stroke: rgba(5, 150, 105, 0.60);
  --gis-isochrone-walk: rgba(14, 165, 233, 0.18);

  /* --- Typography --- */
  --font-family-brand: 'Onest', sans-serif;
  --font-family-sans: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  
  /* Brand Logo ("Go Around") */
  --font-brand-family: var(--font-family-brand);
  --font-brand-size: 24px;
  --font-brand-weight: 500;
  --font-brand-line-height: auto;
  --font-brand-letter-spacing: -0.72px;
  --font-brand-color: #0F172A;

  --font-size-display: 2.0rem;      /* 32px */
  --font-size-h1: 1.5rem;          /* 24px */
  --font-size-h2: 1.25rem;         /* 20px */
  --font-size-h3: 1.0rem;          /* 16px */
  --font-size-body-lg: 0.9375rem;  /* 15px */
  --font-size-body: 0.875rem;      /* 14px */
  --font-size-caption: 0.75rem;    /* 12px */
  --font-size-micro: 0.6875rem;    /* 11px */

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* --- Spacing --- */
  --space-0-5: 2px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* --- Radius --- */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;

  /* --- Elevation / Shadows --- */
  --shadow-none: none;
  --shadow-xs: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(16, 24, 40, 0.10), 0 1px 2px -1px rgba(16, 24, 40, 0.10);
  --shadow-md: 0 4px 6px -1px rgba(16, 24, 40, 0.08), 0 2px 4px -2px rgba(16, 24, 40, 0.04);
  --shadow-lg: 0 10px 15px -3px rgba(16, 24, 40, 0.08), 0 4px 6px -4px rgba(16, 24, 40, 0.03);
  --shadow-floating: 0 20px 25px -5px rgba(0, 77, 64, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.06);

  /* --- Component Dimensions --- */
  --sidebar-width: 240px;
  --topbar-height: 68px;
  --map-controls-offset-right: 20px;
  --detail-drawer-width: 440px;
}
```

---

## 8. Aturan Responsif & Implementasi (Responsive Breakpoints)

| Breakpoint | Nilai Min-Width | Penyesuaian Layout |
|---|---|---|
| **Mobile (`sm`)** | `< 640px` | Sidebar admin collapse ke hamburger menu / drawer; WebGIS drawer berubah menjadi bottom sheet; tabel spasial berubah jadi stacked card. |
| **Tablet (`md`)** | `640px – 1024px` | KPI cards grid 2 kolom; WebGIS drawer list dapat disembunyikan/minimize; filter chips horizontal scrollable. |
| **Desktop (`lg` / `xl`)** | `> 1024px` | Tampilan penuh 2/3 kolom: Sidebar tetap `240px`, KPI grid 4 kolom, WebGIS split view (Left List + Center Map + Right Detail Drawer). |

---

## 9. Penyelarasan dengan API Backend Laravel (`api-contract.md`)

Setiap data token di antarmuka terhubung langsung dengan kontrak field backend berikut:

| Token Visual Komponen | Field API Laravel | Catatan Penanganan UI |
|---|---|---|
| Skor Nugas (`★ 9.7 / 10`) | `nugas_score` (`0 - 100`) | Ditampilkan dibagi 10 di UI (misal: 97 -> `9.7`). |
| WiFi Speed Pill (`82 Mbps`) | `wifi_speed_mbps` | Nilai numerik integer; jika null tampilkan `"Belum Diuji"`. |
| Colokan Listrik (`92%`) | `plug_availability` (`moderate`/`abundant`) & persentase atribut | Visual progress bar + badge label. |
| Akustik & Suasana | `noise_level` (`quiet`, `moderate`, `lively`) | Diterjemahkan ke label bahasa: `Tenang`, `Kondusif`, `Ramai`. |
| Koordinat PostGIS | `latitude`, `longitude` | Ditampilkan dalam format 4 desimal monospace. |
| Status Tayang Badge | `is_verified` (boolean) / `status` | `true` -> "Terverifikasi" (`--color-success`), `false` -> "Perlu Review" (`--color-warning`). |
| Kisaran Harga | `price_min_drink`, `price_max_drink` | Format mata uang Indonesia: `Rp 28.000+`. |
