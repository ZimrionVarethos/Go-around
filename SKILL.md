# SKILL: Go Around WebGIS Backend & Data Engineering

Catatan panduan dan standarisasi pengembangan backend WebGIS "Go Around" (Tempat Nongkrong / Coworking Ramah Kantong Mahasiswa).

---

## 1. Konfigurasi Lingkungan & Keamanan Dependensi

### 1.1 Panduan Instalasi Paket Node (NPM)
Untuk mencegah serangan supply chain (seperti kasus pembajakan paket JavaScript/Node.js):
- **Wajib gunakan `.npmrc`** dengan setting:
  ```ini
  ignore-scripts=true
  audit=true
  save-exact=true
  ```
- **Instalasi Aman**:
  ```bash
  # Di development (selalu review paket sebelum install):
  npm install <package-name> --ignore-scripts --save-exact
  
  # Di server / CI (hanya install dari package-lock):
  npm ci --ignore-scripts
  ```
- **Audit Rutin**:
  ```bash
  npm audit
  composer audit
  ```

---

## 2. Standar Data Carving & Format Spasial

### 2.1 Format Koordinat & Konvensi
- **Sistem Koordinat**: WGS84 (SRID 4326 / EPSG:4326).
- **Format Output API**: GeoJSON Standar (RFC 7946).
- Urutan koordinat di GeoJSON: `[longitude, latitude]` (Ingat: Longitude dulu, baru Latitude).

### 2.2 Atribut Wajib Tempat (Place Schema Checklist)
Setiap data tempat yang di-carve atau disubmit harus memiliki:
1. `name`: Nama tempat / warkop / coworking space.
2. `latitude` & `longitude`: Titik koordinat valid.
3. `price_min_drink` & `price_avg_food`: Indikator harga terjangkau mahasiswa.
4. `wifi_speed`: Kecepatan download dalam Mbps (atau estimasi).
5. `plug_availability`: `abundant` (banyak/hampir tiap meja), `moderate` (cukup), `limited` (sedikit), `none`.
6. `noise_level`: `quiet` (cocok skripsi/fokus), `moderate` (santai/nugas bareng), `loud` (nobar/nongkrong ramai).
7. `is_24_hours`: Boolean operasional 24 jam.

---

## 3. Workflow Integrasi Machine Learning

### 3.1 Pipeline Data ML
1. **Ekspor Data**: Data tempat dari database diekspor ke format CSV / JSON untuk training.
   ```bash
   php artisan ml:export-dataset
   ```
2. **Training & Evaluasi (Python)**:
   - Script training klasifikasi tier / klastering di folder `ml/` atau notebook riset.
   - Output model: File metrik / bobot skor atau pre-computed classifications.
3. **Impor Hasil Prediksi ke Laravel**:
   - Update kolom `ml_tier`, `ml_study_score`, `ml_budget_score` ke tabel `places`.
   ```bash
   php artisan ml:sync-scores
   ```

---

## 4. Standar Query Spasial Laravel & Keamanan SQL

### 4.1 Safe Parameterized Spatial Queries
Selalu gunakan parameter binding untuk mencegah SQL Injection pada fungsi spasial:

```php
// Contoh query pencarian radius aman (Haversine / Spatial Sphere):
$places = Place::query()
    ->select('places.*')
    ->selectRaw(
        '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance_km',
        [$userLat, $userLng, $userLat]
    )
    ->having('distance_km', '<=', $radiusKm)
    ->orderBy('distance_km')
    ->get();
```

---

## 5. Log Catatan Pribadi Developer
*(Silakan isi catatan perkembangan, penemuan baru, atau kustomisasi di bagian ini)*

- [ ] Evaluasi dataset tempat area kampus target
- [ ] Penyesuaian bobot scoring ML (TOPSIS / Content-based)
- [ ] Pengujian performa spatial bounding-box query
