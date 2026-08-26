# Go Around: WebGIS "Tempat Nongkrong / Working Space Ramah Kantong Mahasiswa"
## Master Architecture, Data Carving, ML Pipeline, and Security Blueprint

---

## 1. Project Overview & Current Status Audit

### 1.1 Hasil Pengecekan Workspace
- **Lokasi Project**: `d:\Proyekweb\backend\go-around` (Laravel 11/12 skeleton dengan PHP 8.2/8.3+).
- **Audit Dependency Saat Ini**:
  - `composer.json`: Framework Laravel standar, bersih tanpa package berisiko.
  - `package.json`: Hanya devDependencies inti (`tailwindcss v4`, `@tailwindcss/vite`, `laravel-vite-plugin`, `vite`, `concurrently`).
  - `.npmrc`: Sudah dikonfigurasi secara aman dengan `ignore-scripts=true` dan `audit=true`.
  - **Status Supply Chain**: **Aman**. Tidak ditemukan dependensi berbahaya, library bajakan/typosquatting, maupun versi compromised dari Axios, Keyv, atau TanStack.

---

## 2. Strategi Data Carving & Data Engineering

### 2.1 Sumber Data (Data Ingestion Channels)
1. **Open & Public Geospatial Data**: OpenStreetMap (OSM) via Overpass API (`amenity=cafe`, `amenity=coworking_space`, `amenity=fast_food`, `internet_access=wlan`).
2. **Google Places / Scraped Metadata**: Data awal titik koordinat, rating Google, ulasan seputar "colokan", "wifi", dan "harga".
3. **Crowd-Sourced Submissions**: Form kontribusi mahasiswa via WebGIS (verifikasi bertingkat).
4. **Direct Field Survey**: Validasi sampling parameter krusial (kecepatan Wi-Fi, ketersediaan colokan per meja, harga menu termurah-termahal).

### 2.2 Feature Matrix (Atribut Data Carving)
Data yang di-*carve* dikelompokkan ke dalam 4 dimensi:

| Dimensi | Atribut | Tipe Data & Format | Indikator Mahasiswa |
| :--- | :--- | :--- | :--- |
| **Geospatial** | `latitude`, `longitude`, `address`, `subdistrict`, `near_campus_tags` | Float / Point geometry, String | Kedekatan dengan kampus / kos |
| **Ekonomi (Kantong)** | `min_drink_price`, `max_drink_price`, `min_food_price`, `avg_spend_per_hour`, `parking_fee`, `is_free_parking`, `student_discount` | Integer (IDR), Boolean | Murah (< Rp 15rb), Sedang (Rp 15-28rb), Coworking (> Rp 30rb) |
| **Fasilitas Kerja** | `wifi_speed_mbps`, `power_outlets_ratio`, `has_indoor_ac`, `has_smoking_area`, `chair_ergonomics`, `desk_space_score` | Float, Enum (`per_table`, `abundant`, `limited`, `none`), Score 1-5 | Kebutuhan laptop & deadline |
| **Suasana & Operasional**| `noise_level`, `opening_hours`, `is_24_hours`, `has_prayer_room`, `restroom_cleanliness`, `crowd_peak_hours` | Enum (`quiet`, `moderate`, `lively`), JSON, Boolean, Rating 1-5 | Suasana skripsi / nugas kelompok |

### 2.3 Data Cleaning & Normalization Pipeline
1. **Deduplikasi Spasial**: Radius clustering (< 15 meter) + Levenshtein distance pada nama tempat untuk mencegah duplikasi.
2. **Text Parsing & Feature Extraction**: Ekstraksi keyword ulasan (e.g., "colokan banyak", "wifi kenceng", "ramah kantong") menggunakan NLP regex / lemmatization.
3. **Imputation & Outlier Handling**: Mengisi missing values pada jam buka atau fasilitas dengan default berbasis klaster wilayah.

---

## 3. Machine Learning Integration (Modeling & Classification)

### 3.1 Rencana Pemodelan ML
1. **Classification (Student-Friendly Tiering)**:
   - **Target**: Mengelompokkan tempat menjadi 3-4 kelas:
     - `Tier 1 - Warung / Warkop Modern Budget` (Kopi < 10k, Wi-Fi standard, colokan melimpah, suasana santai).
     - `Tier 2 - Mahasiswa Hybrid Cafe` (Minuman 15k-25k, Wi-Fi cepat, AC, colokan per meja).
     - `Tier 3 - Dedicated Coworking & Study Space` (Tarif jam/hari, Wi-Fi ultra cepat, silent room, meeting room).
   - **Model Candidate**: Random Forest Classifier / XGBoost / LightGBM.
2. **Clustering & Spatial Hotspot (DBSCAN / K-Means)**:
   - Identifikasi konsentrasi "Zona Nugas Hemat" di sekitar area kampus.
3. **Smart Recommendation & Multi-Criteria Scoring (TOPSIS / AHP / Content-Based)**:
   - Scoring dinamis berdasarkan bobot prioritas mahasiswa (misal: Mahasiswa A memprioritaskan "Murah + Banyak Colokan", Mahasiswa B "Wi-Fi Kencang + Hening").

### 3.2 Arsitektur Integrasi ML dengan Laravel
- **Opsi A (Batch Processing / Pre-computed - Recommended for Start)**: Pipeline Python mengekspor skor dan label klasifikasi ke database (PostgreSQL/MySQL) atau tabel `ml_predictions` via artisan command `php artisan ml:sync`.
- **Opsi B (Real-time FastAPI / ONNX Microservice)**: Laravel memanggil API Python internal (via Private HTTP/gRPC) saat ada tempat baru yang disubmit atau query pencarian terpersonalisasi.

---

## 4. Alur & Arsitektur WebGIS (Laravel Backend)

### 4.1 Flow Diagram
```mermaid
graph TD
    User["Client WebGIS (Browser/Leaflet/MapLibre)"]
    API["Laravel REST API / GeoJSON Endpoint"]
    Auth["Laravel Sanctum (Role & Throttling)"]
    Cache["Redis Spatial / GeoHash Cache"]
    DB[("Spatial Database (PostGIS / MySQL Spatial)")]
    ML["ML Service / Pre-computed Inference"]

    User -->|1. BBox / Radius Query (Lat, Lng, Filters)| API
    API --> Auth
    Auth --> Cache
    Cache -->|Cache Hit| API
    Cache -->|Cache Miss| DB
    DB --> ML
    API -->|2. GeoJSON FeatureCollection + ML Score| User
```

### 4.2 Database Schema & Spatial Querying
- **Database Engine**: PostgreSQL + PostGIS (Direkomendasikan untuk spatial indexing `ST_DWithin`, `ST_Distance`) atau MySQL 8.0+ dengan spatial data types (`POINT`, `SPATIAL INDEX`).
- **Endpoint Utama**:
  - `GET /api/v1/places/nearby?lat={lat}&lng={lng}&radius={km}&tier={tier}&min_wifi={mbps}`: Spatial radius search.
  - `GET /api/v1/places/bbox?north={}&south={}&east={}&west={}&zoom={}`: Bounding-box search untuk viewport peta dengan dynamic clustering.
  - `GET /api/v1/places/recommend`: Rekomendasi terbobot berdasarkan preferensi mahasiswa.
  - `POST /api/v1/places/contribute`: Submission tempat baru oleh komunitas (masuk status `pending_review`).
  - `POST /api/v1/places/{id}/feedback`: Crowdsourced feedback (update kecepatan wifi / colokan terkini).

---

## 5. Security Blueprint & Supply Chain Attack Prevention

### 5.1 Supply Chain Security (npm & Composer)
Belajar dari insiden pembajakan paket JavaScript/Node (seperti kasus supply chain Axios, Keyv, TanStack, dsb.):

1. **Strict NPM Execution Policy**:
   - `.npmrc` wajib selalu aktif dengan:
     ```ini
     ignore-scripts=true
     audit=true
     save-exact=true
     ```
   - Mencegah eksekusi lifecycle script otomatis (`postinstall`, `preinstall`) saat `npm install`.
2. **Pinning Dependencies (Exact Versions)**:
   - Gunakan versi eksak di `package.json` tanpa wildcard/carat (`^` atau `~`) jika menginstal library pihak ketiga kritis.
3. **Lockfile Integrity**:
   - Selalu commit `package-lock.json` dan `composer.lock`.
   - Gunakan `npm ci` di lingkungan CI/CD / Deployment, bukan `npm install`.
4. **Native Fetch Replacement**:
   - Untuk integrasi frontend, prioritaskan penggunaan Web API standar (`fetch`) ketimbang menginstal library HTTP client eksternal yang rentan supply chain hijack bila tidak diperlukan.
5. **Vulnerability Scanning**:
   - Jalankan `npm audit` dan `composer audit` secara berkala.

### 5.2 Application & Spatial API Security
1. **Spatial SQL Injection Protection**:
   - Gunakan parameter binding pada fungsi spasial (contoh: `DB::raw("ST_Distance_Sphere(location, POINT(?, ?))", [$lng, $lat])`).
2. **Rate Limiting & Anti-Scraping**:
   - Batasi query spasial agresif via Laravel `RateLimiter` (misal 60 request/menit untuk public bbox query) untuk mencegah scraping database titik tempat.
3. **Content Security Policy (CSP) & CORS**:
   - Izinkan hanya domain tile provider resmi (OpenStreetMap, CartoDB, Mapbox, Stadia) pada CSP header.
   - Set konfigurasi `cors.php` dengan origin whitelist yang ketat.
4. **Input Sanitization & Role-Based Moderation**:
   - Crowdsource input wajib melewati Form Request Validation & Purifier (mencegah XSS pada field deskripsi/nama cafe).
   - Hak cipta moderasi data diatur menggunakan Laravel Gate & Policy.

---

## 6. Rencana Tahapan Eksekusi (Extensible Roadmap)

### Fase 1: Core Setup & Data Foundation
- Setup database migrations & spatial models (`Place`, `Amenity`, `PriceTier`, `OperatingHour`).
- Implementasi schema validasi spasial & GeoJSON Resource formatter.
- Pembuatan seeder data awal dan script ingestion data hasil carving.

### Fase 2: Spatial API & Filtering Engine
- Endpoint Spatial Search (`/nearby`, `/bbox`) dengan spatial index optimization.
- Filter multi-kriteria (Rentang harga, Wi-Fi speed, tipe colokan, 24 jam).
- Spatial response caching untuk menjaga performa loading peta.

### Fase 3: Integrasi Machine Learning
- Pipeline data training (Python notebook / script).
- Implementasi klasifikasi tier tempat & scoring rekomendasi cerdas.
- Integrasi pipeline skor ML ke dalam query API Laravel.

### Fase 4: Community Crowdsourcing & Security Hardening
- Sistem kontribusi mahasiswa + modul admin review.
- Security audit (Rate limiting, CSP headers, Sanitization, Composer & NPM audits).
