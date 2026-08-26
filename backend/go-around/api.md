# Go Around: WebGIS REST API Documentation (Kota Bogor)

Dokumentasi lengkap RESTful API backend **Go Around** untuk platform WebGIS "Tempat Nongkrong / Working Space Ramah Kantong Mahasiswa di Kota Bogor".

---

## 1. Ringkasan & Konfigurasi Dasar

- **Base URL (Localhost)**: `http://127.0.0.1:8000/api/v1`
- **Format Payload & Response**: JSON / GeoJSON (RFC 7946)
- **Sistem Koordinat**: WGS84 (`[longitude, latitude]`)
- **Kota Fokus**: Kota Bogor (Kecamatan: *Bogor Tengah, Bogor Timur, Bogor Utara, Bogor Selatan, Bogor Barat, Tanah Sareal*)

---

## 2. Daftar Endpoint Ringkas

| Method | Endpoint | Fungsi / Deskripsi | Format Output |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Cek status server API & versi | JSON |
| `GET` | `/places` | Mengambil daftar tempat dengan filter & paginasi | JSON Paginated |
| `GET` | `/places/bbox` | Query tempat di dalam area viewport peta | **GeoJSON FeatureCollection** |
| `GET` | `/places/nearby` | Mencari tempat terdekat dari titik koordinat GPS | **GeoJSON FeatureCollection** |
| `GET` | `/places/recommend`| Rekomendasi terbobot preferensi mahasiswa | JSON / GeoJSON |
| `GET` | `/places/subdistricts` | Daftar kecamatan di Kota Bogor & jumlah tempat | JSON |
| `GET` | `/places/{idOrSlug}`| Detail lengkap tempat, fasilitas, rute, & ulasan | JSON Detail |
| `GET` | `/categories` | Daftar kategori tempat (Warkop, Cafe, Coworking) | JSON |
| `GET` | `/amenities` | Daftar fasilitas (Wi-Fi kencang, colokan, AC, dll) | JSON |
| `POST`| `/contributions` | Form kontribusi tempat baru dari komunitas | JSON (201 Created) |

---

## 3. Detail Spesifikasi Endpoint

### 3.1 Health Check
* **Endpoint**: `GET /health`
* **Deskripsi**: Verifikasi kesiapan server backend.

---

### 3.2 List Places (Filter & Paginasi)
* **Endpoint**: `GET /places`
* **Query Parameters (Opsional)**:
  * `search`: Pencarian nama cafe, alamat, atau tag suasana (contoh: `maraca` atau `kopi susu`).
  * `subdistrict`: Filter nama kecamatan (contoh: `Bogor Tengah` atau `Bogor Tengah,Bogor Timur`).
  * `category`: Slug kategori (contoh: `coworking-study-space`, `warkop-modern`, `cozy-coffee-shop`).
  * `price_tier`: Tingkat harga (`1` = Budget <15k, `2` = Standar 15-28k, `3` = Coworking >30k).
  * `max_price`: Harga maksimal minuman termurah dalam IDR (contoh: `15000`).
  * `min_wifi`: Kecepatan minimal Wi-Fi dalam Mbps (contoh: `40`).
  * `plug_availability`: Ketersediaan colokan (`abundant`, `moderate`, `limited`).
  * `noise_level`: Tingkat kebisingan (`quiet`, `moderate`, `lively`).
  * `is_24_hours`: Boolean (`true` / `1`) untuk tempat 24 jam.
  * `has_student_discount`: Boolean (`true` / `1`) untuk promo KTM mahasiswa.
  * `min_nugas_score`: Nilai minimal skor nugas 0 - 100 (contoh: `85`).
  * `amenities`: Filter fasilitas spesifik dipisah koma (contoh: `musholla,colokan-melimpah`).
  * `sort_by`: Kolom pengurutan (`nugas_score`, `budget_score`, `facility_score`, `price_min_drink`, `wifi_speed_mbps`, `google_rating`).
  * `order`: `asc` atau `desc` (default: `desc`).
  * `per_page`: Jumlah data per halaman (default: `15`).

---

### 3.3 Viewport Bounding Box (`/places/bbox`)
* **Endpoint**: `GET /places/bbox`
* **Kegunaan**: Digunakan langsung oleh library peta (Leaflet / MapLibre / Mapbox) saat peta digeser (*drag/pan*) atau di-zoom.
* **Format Response**: GeoJSON RFC 7946 `FeatureCollection`.

---

### 3.4 Nearby Radius Search (`/places/nearby`)
* **Endpoint**: `GET /places/nearby`
* **Query Parameters**: `lat`, `lng`, `radius_km` (default: 10).
* **Format Response**: GeoJSON `FeatureCollection` dengan properti jarak `distance_km`.

---

### 3.5 Personalized Smart Recommendation (`/places/recommend`)
* **Endpoint**: `GET /places/recommend`
* **Query Parameters**: `w_budget`, `w_wifi`, `w_plug`, `w_quiet`, `lat`, `lng`.

---

### 3.6 Detail Tempat Lengkap (`/places/{idOrSlug}`)
* **Endpoint**: `GET /places/maraca-books-and-coffee` atau `GET /places/1`

---

### 3.7 Metadata Kategori & Fasilitas
* `GET /categories`
* `GET /amenities`
* `GET /places/subdistricts`

---

### 3.8 Submit Kontribusi Komunitas (`POST /contributions`)
* `POST /contributions`
