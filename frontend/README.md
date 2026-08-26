# Go Around WebGIS Frontend (Next.js 14)

Aplikasi WebGIS modern untuk pemetaan dan pencarian tempat nugas / working space ramah kantong mahasiswa di Kota Bogor.

---

## Panduan Menjalankan di Local

1. Masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka di browser: `http://localhost:3000`

---

## Deploy ke Vercel

Aplikasi ini sudah dioptimasi untuk deployment instan di Vercel:
1. Push repository ini ke GitHub.
2. Impor project di dashboard Vercel dengan **Root Directory**: `frontend`.
3. Framework Preset otomatis mendeteksi **Next.js**.
4. *(Opsional)* Jika backend Laravel sudah dideploy online, tambahkan Environment Variable:
   - `NEXT_PUBLIC_API_URL`: URL API Laravel kamu (contoh: `https://api.goaround.my.id/api/v1`).
   - Jika backend belum ada/offline, frontend otomatis menggunakan data fallback Kota Bogor bawaan tanpa error.
