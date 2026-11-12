# Agent Guidelines & Workflow Rules — Go-around

## ⚠️ Konfirmasi & Persetujuan Sebelum Modifikasi (CRITICAL)
- **Selalu Tanyakan & Konfirmasi Terlebih Dahulu Sebelum Mengubah Berkas**:
  - Jangan langsung melakukan *bulk execution* / menulis perubahan ke banyak berkas tanpa konfirmasi eksplisit dari user di setiap langkahnya.
  - Jelaskan rancangan perubahan (file mana saja dan apa yang diubah), lalu **tunggu konfirmasi atau persetujuan user** sebelum memanggil tool penulisan file (`write_to_file`, `replace_file_content`, `multi_replace_file_content`).
  - Berikan kesempatan bagi user untuk meninjau perubahan per bagian/per langkah.

---

## 🗺️ Konteks Proyek & Arsitektur
- **Nama Proyek**: Go-around (WebGIS Tempat Nugas & Kafe Ramah Mahasiswa Kota Bogor).
- **Frontend Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, React Leaflet 5 & Leaflet, `@phosphor-icons/react`.
- **Backend Stack**: Laravel 13 (REST API di `backend/go-around/`).
- **Fokus Spasial**: Analisis SIG seputar Kota Bogor & lingkungan kampus IPB University (misal: radius buffer, isochrone, klaster kepadatan, dan koridor transit Biskita Transpakuan). Wilayah administratif wajib fokus pada **6 Kecamatan Kota Bogor** (*Bogor Tengah, Bogor Timur, Bogor Utara, Bogor Barat, Tanah Sareal, Bogor Selatan*).
- **Integritas Desain**: Pertahankan konsistensi visual modern (nuansa warna teal `#005B54`, font sans bersih, floating controls yang rapi di atas peta).

---

## 🎨 Standar Ikonografi: Phosphor Icons (`@phosphor-icons/react`)
- **Gunakan `@phosphor-icons/react` di Seluruh Proyek**:
  - Wajib menggunakan ikon dari `@phosphor-icons/react` pada seluruh halaman **WebGIS Publik** maupun **Panel Admin** (jangan gunakan `lucide-react`).
  - **Ikon Colokan Listrik (Plug)**: Gunakan `<PlugChargingIcon />` (misal `<PlugChargingIcon size={32} />` pada kartu fasilitas atau ukuran proporsional pada badge/tabel) serta `<PlugIcon />` untuk kondisi terbatas.
  - **Ikon Kecepatan Wi-Fi Dinamis**: Wajib menyesuaikan secara dinamis berdasarkan kecepatan (`Mbps`) atau kualitas Wi-Fi:
    - Lambat / Ngelag (`< 25 Mbps` atau `low`): `<WifiLowIcon />` (`text-rose-600`)
    - Lumayan / Standar (`25–49 Mbps` atau `medium`): `<WifiMediumIcon />` (`text-amber-600`)
    - Kencang (`>= 50 Mbps` atau `fast` / `ultra`): `<WifiHighIcon />` (`text-[#005B54]` / `text-emerald-600`)
    - Tidak tersedia / Mati (`null` atau `0`): `<WifiSlashIcon />` (`text-slate-400`)
  - Gunakan *semantic coloring* dan *weight* Phosphor (`regular`, `bold`, `fill`, `duotone`) secara konsisten agar hierarki visual jelas dan estetis.

---

## 📱 Standar Responsivitas Semua Device (Mobile, Tablet, Desktop)
- **Wajib Responsif di Seluruh Ukuran Layar**:
  - **Mobile (`320px – 639px`)**: Tidak boleh ada teks/tombol yang terpotong (*horizontal overflow*). Panel di atas peta (`RecommendationPanel` & `PlaceDetailDrawer`) wajib berbentuk *Bottom Sheet* yang nyaman di-scroll dan tidak saling menumpuk dengan kontrol peta. Tabel admin otomatis memiliki tampilan kartu mobile (`PlacesMobileList`).
  - **Tablet (`640px – 1023px`)**: Toolbar filter & aksi menggunakan `flex-wrap` atau scroll horizontal yang halus tanpa memotong komponen.
  - **Laptop & Desktop (`>= 1024px`)**: Tabel lebar membungkus `overflow-x-auto` hanya pada elemen `<table>`, sedangkan bar *Pagination & Batch Actions* (`< 1 2 3 >`) wajib tetap rata penuh (`100%`) di bagian bawah kartu.
