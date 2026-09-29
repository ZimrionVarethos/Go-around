# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Mahasiswa di Kota Bogor, terutama mahasiswa IPB University dan kampus sekitarnya, yang sedang mencari tempat untuk belajar, mengerjakan tugas, rapat kelompok, atau bekerja dari kafe.

## Product Purpose

Go-around adalah WebGIS untuk menemukan dan membandingkan tempat nugas serta kafe ramah mahasiswa di Kota Bogor. Keberhasilan produk berarti pengguna dapat menemukan tempat yang sesuai dengan lokasi, budget, dan kebutuhan fasilitasnya tanpa harus membuka banyak sumber terpisah.

## Positioning

Go-around menggabungkan pencarian spasial dengan atribut yang relevan untuk kegiatan belajar—seperti jarak, harga, Wi-Fi, colokan, kebisingan, jam buka, dan fasilitas—serta menjelaskan alasan di balik setiap rekomendasi.

## Operating Context

Pengguna membuka peta, memberikan atau memilih lokasi, menerapkan quick filter atau kriteria lanjutan, lalu membandingkan rekomendasi berbentuk daftar dan marker. Data tempat berasal dari sumber eksternal, kontribusi pengguna, dan verifikasi lapangan; nilai yang belum diketahui harus tetap dinyatakan sebagai tidak diketahui.

## Capabilities and Constraints

- Frontend menggunakan Next.js 16, React 19, TypeScript, Tailwind CSS 4, React Leaflet 5, dan Leaflet.
- Backend menggunakan Laravel 13 dan menyediakan REST API.
- Peta berfokus pada Kota Bogor dan lingkungan kampus IPB University.
- Ranking utama dihitung backend; frontend menampilkan hasil dan penjelasannya tanpa menciptakan fakta fasilitas.
- Frontend harus dapat beralih dari mock gateway ke HTTP API tanpa menulis ulang komponen.
- Integrasi AI berjalan melalui backend dan tidak menjadi sumber kebenaran untuk data tempat.
- Atribut yang belum tersedia direpresentasikan sebagai `null`, bukan nilai default yang tampak terverifikasi.

## Brand Commitments

- Nama produk: Go-around.
- Warna utama teal `#005B54`.
- Tipografi sans-serif yang bersih.
- Kontrol peta menggunakan pola floating controls yang rapi.
- Bahasa antarmuka utama adalah Bahasa Indonesia dengan nada ringkas dan ramah mahasiswa.

## Evidence on Hand

- Dataset awal berisi 2.934 tempat di Kota Bogor dengan tingkat kelengkapan atribut yang bervariasi.
- Repository sudah memiliki halaman peta, endpoint bounding-box dan nearby, panel rekomendasi, quick filter, model tempat/fasilitas/review, serta spatial search service.
- Belum ada bukti yang membenarkan klaim fasilitas ketika kolom sumber kosong; antarmuka tidak boleh mengarang nilai pengganti.

## Product Principles

- Tampilkan ketidakpastian data secara jujur.
- Jelaskan alasan ranking, bukan hanya angka skor.
- Utamakan keputusan cepat di atas peta; sembunyikan kontrol lanjutan sampai dibutuhkan.
- Pertahankan pencarian manual sebagai fallback ketika AI atau lokasi tidak tersedia.
- Jaga kontrak frontend-backend agar sumber data dapat diganti tanpa mengubah pengalaman pengguna.

## Accessibility & Inclusion

Alur utama harus dapat digunakan dengan keyboard, tidak bergantung pada warna saja, menyediakan status loading/error yang dapat diumumkan pembaca layar, menghormati preferensi reduced motion, dan menyediakan alternatif ketika izin lokasi ditolak.
