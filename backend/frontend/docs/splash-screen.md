# Splash screen Go Around

Splash halaman `/` menampilkan dua mahasiswa berhelm naik motor menuju pin tujuan, lalu wordmark sebelum peta terbuka. Desain mengikuti preview yang disetujui: Onest untuk wordmark, Plus Jakarta Sans untuk teks, teal `#005B54`, dan kanvas krem `#F6F4ED`. Warna dan font utama menggunakan token yang sudah ada di `app/globals.css`.

Splash penuh muncul setiap kali halaman peta `/` dibuka, termasuk refresh serta navigasi kembali dari Tambah Tempat, Lapor Fasilitas, dan halaman publik lain. Link menuju halaman selain peta memakai feedback ringan sampai halaman tujuan terpasang. Feedback ringan memiliki durasi minimum singkat agar navigasi yang sudah siap melalui prefetch tetap terasa jelas.

## Alur dan aksesibilitas

- Animasi perjalanan berlangsung 4.200 ms, diikuti fade 280 ms. Peta dimuat di belakang splash.
- Splash dirender sejak HTML pertama halaman peta agar fallback peta tidak berkedip sebelum ilustrasi motor.
- Splash diputar ulang setiap kali halaman peta dipasang, termasuk setelah refresh dan navigasi kembali ke `/`.
- Tombol Lewati dan Escape langsung membuka peta. Fokus awal berada di Lewati; fokus setelah splash berada di elemen `main` peta.
- Konten peta menggunakan `inert` dan `aria-hidden` selama splash. Permintaan lokasi otomatis baru aktif setelah splash ditutup.
- Preferensi reduced motion melewati animasi dalam 200 ms. Perubahan preferensi ke reduced motion saat splash berjalan juga menutupnya.
- Perjalanan mulai setelah gambar siap atau gagal dimuat. Batas tunggu 1.200 ms mencegah gambar lambat menahan pengguna. Timer penutup tetap bekerja tanpa bergantung pada event animasi CSS.
- Garis perjalanan menunjukkan urutan animasi, bukan persentase unduhan atau kesiapan data peta.
- Motor menyelesaikan perjalanan di sisi kanan dekat pin tujuan pada desktop, ponsel, dan landscape pendek; grup pin beserta label tujuan berada sedikit lebih tinggi dan ke kanan serta tetap di lapisan terdepan.

## Berkas

- `components/splash/WebGisExperience.tsx`: sesi, komposisi halaman utama, inert, perpindahan fokus, dan izin lokasi.
- `components/splash/SplashScreen.tsx`: markup, durasi, status, reduced motion, dan penanganan gambar.
- `components/splash/SplashScreen.module.css`: adegan, keyframes, layar sempit, dan landscape pendek.
- `components/map/MapPage.tsx`: prop `locationEnabled` menunda GPS tanpa menunda pemuatan peta.
- `components/loading/GoAroundLoader.tsx`: loading state ringan untuk route dan kanvas peta.
- `components/loading/NavigationFeedback.tsx`: feedback navigasi untuk link internal serta tombol Back/Forward browser yang tujuannya bukan peta.
- `public/images/splash/go-around-riders.webp`: ilustrasi transparan 768 × 512, sekitar 81 KB, dibuat dengan ImageGen untuk preview yang disetujui. Asal aset tercatat di berkas `.webp.json` pendamping.

`MapPage` diimpor langsung dari berkasnya oleh `WebGisExperience`; jangan menggantinya dengan barrel `components/map`, karena barrel tersebut juga mengekspor `MapView` yang memuat Leaflet khusus browser.

Untuk melihat perjalanan penuh, preferensi gerakan browser/OS harus normal. Reduced motion memang membuka peta dengan cepat.

## Verifikasi implementasi

Lolos lint pada berkas yang diubah, TypeScript, build produksi, dan pemeriksaan browser desktop 1440 × 900, ponsel 390 × 844, serta landscape 844 × 390. Alur otomatis, Lewati lewat keyboard, Escape, fokus, GPS tertunda, reload dalam sesi yang sama, reduced motion, storage diblokir, dan gambar gagal dimuat sudah diperiksa tanpa error runtime browser.

Sistem desain global dipertahankan. Tidak ada aturan visual baru yang diberlakukan pada halaman lain.
