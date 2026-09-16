# Agent Guidelines & Workflow Rules — Go-around

## ⚠️ Konfirmasi & Persetujuan Sebelum Modifikasi (CRITICAL)
- **Selalu Tanyakan & Konfirmasi Terlebih Dahulu Sebelum Mengubah Berkas**:
  - Jangan langsung melakukan *bulk execution* / menulis perubahan ke banyak berkas tanpa konfirmasi eksplisit dari user di setiap langkahnya.
  - Jelaskan rancangan perubahan (file mana saja dan apa yang diubah), lalu **tunggu konfirmasi atau persetujuan user** sebelum memanggil tool penulisan file (`write_to_file`, `replace_file_content`, `multi_replace_file_content`).
  - Berikan kesempatan bagi user untuk meninjau perubahan per bagian/per langkah.

---

## 🗺️ Konteks Proyek & Arsitektur
- **Nama Proyek**: Go-around (WebGIS Tempat Nugas & Kafe Ramah Mahasiswa Kota Bogor).
- **Frontend Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, React Leaflet 5 & Leaflet.
- **Backend Stack**: Laravel 13 (REST API di `backend/go-around/`).
- **Fokus Spasial**: Analisis SIG seputar Kota Bogor & lingkungan kampus IPB University (misal: radius buffer, isochrone, klaster kepadatan, dan koridor transit Biskita Transpakuan).
- **Integritas Desain**: Pertahankan konsistensi visual modern (nuansa warna teal `#005B54`, font sans bersih, floating controls yang rapi di atas peta).
