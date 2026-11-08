# Go Around — API Contract Frontend

> Audit berdasarkan source backend `backend/go-around` yang diberikan.
> Base URL lokal: `http://127.0.0.1:8000/api/v1`

## 1. Status Audit

- Backend: Laravel 13 (`laravel/framework ^13.17`), PHP `^8.3`.
- API menggunakan JSON dan beberapa endpoint menggunakan GeoJSON RFC 7946.
- Koordinat: WGS84 dengan urutan GeoJSON `[longitude, latitude]`.
- Tidak ditemukan middleware authentication/authorization pada route API saat audit.
- Tidak ditemukan endpoint khusus untuk **Report & Correct Cafe Facilities**.
- Endpoint kontribusi yang tersedia hanya untuk **Add & Recommend New Study Place**.
- Tidak ditemukan upload file/image langsung pada endpoint kontribusi.
- Backend menerima data teks + koordinat; tidak ada field `image_url` pada tabel/controller contribution.

## 2. Frontend Scope vs Backend

| Frontend page/feature | Backend support | Endpoint |
|---|---|---|
| Home — daftar tempat | Ya | `GET /places` |
| Home — marker berdasarkan viewport map | Ya | `GET /places/bbox` |
| Home — tempat terdekat | Ya | `GET /places/nearby` |
| Home — rekomendasi | Ya | `GET /places/recommend` |
| Home — detail tempat | Ya | `GET /places/{idOrSlug}` |
| Home — filter kategori | Ya | `GET /categories` + `/places?category=...` |
| Home — filter fasilitas | Ya | `GET /amenities` + `/places?amenities=...` |
| Home — daftar kecamatan | Ya | `GET /places/subdistricts` |
| Add & Recommend New Study Place | Ya, tetapi field terbatas | `POST /contributions` |
| Report & Correct Cafe Facilities | **Tidak tersedia** | — |
| Upload foto via Cloudinary | Belum didukung backend contribution | — |
| User login/register | Tidak diperlukan untuk endpoint publik saat ini | — |
| Admin authentication | Belum ada pada API yang diaudit | — |

## 3. GET /health

### Request

`GET /api/v1/health`

### Response

```json
{
  "status": "healthy",
  "app": "Go Around - WebGIS Nugas Ramah Kantong Mahasiswa (Kota Bogor)",
  "version": "1.0.0",
  "timestamp": "2026-09-14T00:00:00+00:00"
}
```

## 4. GET /places

Mengambil daftar tempat aktif dengan filter, sorting, dan pagination.

### Query parameters

| Parameter | Tipe | Required | Keterangan |
|---|---|---:|---|
| `search` | string | No | Cari nama, alamat, atau vibe tags |
| `subdistrict` | string / array | No | Satu atau beberapa kecamatan, dipisahkan koma |
| `category` | string | No | Slug kategori |
| `price_tier` | string / array | No | `1`, `2`, `3`; bisa comma-separated |
| `max_price` | integer | No | Harga minimum minuman maksimum |
| `min_wifi` | integer | No | Minimum Wi-Fi Mbps |
| `plug_availability` | string / array | No | `none`, `limited`, `moderate`, `abundant` |
| `noise_level` | string / array | No | `quiet`, `moderate`, `lively` |
| `is_24_hours` | boolean | No | Jika true, hanya tempat 24 jam |
| `has_student_discount` | boolean | No | Jika true, hanya yang punya diskon mahasiswa |
| `min_nugas_score` | number | No | Minimum skor nugas 0–100 |
| `amenities` | string / array | No | Slug fasilitas, comma-separated |
| `sort_by` | string | No | `nugas_score`, `budget_score`, `facility_score`, `price_min_drink`, `wifi_speed_mbps`, `google_rating`, `name` |
| `order` | string | No | `asc` / `desc`; default `desc` |
| `per_page` | integer | No | Default 15 |

### Response shape

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "category_id": 1,
      "name": "Contoh Cafe",
      "slug": "contoh-cafe",
      "address": "...",
      "subdistrict": "Bogor Tengah",
      "latitude": -6.59,
      "longitude": 106.79,
      "google_maps_url": "...",
      "instagram_handle": "@contohcafe",
      "price_min_drink": 15000,
      "price_max_drink": 30000,
      "price_avg_food": 25000,
      "price_tier": 2,
      "parking_fee_motor": 2000,
      "has_student_discount": true,
      "wifi_speed_mbps": 50,
      "wifi_quality": "fast",
      "plug_availability": "abundant",
      "noise_level": "quiet",
      "is_24_hours": false,
      "open_time": "09:00:00",
      "close_time": "22:00:00",
      "google_rating": 4.7,
      "total_google_reviews": 1000,
      "nugas_score": 90,
      "budget_score": 85,
      "facility_score": 95,
      "image_url": "https://...",
      "description": "...",
      "vibe_tags": "Tenang, Banyak Colokan",
      "status": "active",
      "created_at": "...",
      "updated_at": "...",
      "category": { "id": 1, "name": "Cafe", "slug": "...", "icon": "..." },
      "amenities": [
        { "id": 1, "name": "Wi-Fi Cepat", "slug": "wifi-cepat", "icon": "wifi", "group": "workspace", "pivot": { "detail": "..." } }
      ]
    }
  ],
  "pagination": {
    "total": 20,
    "per_page": 15,
    "current_page": 1,
    "last_page": 2
  }
}
```

> Catatan: `PlaceController@index` mengembalikan model Eloquent langsung, bukan `PlaceGeoJsonResource`. Karena query otomatis eager-load `category` dan `amenities`, frontend perlu menangani shape ini sebagai response list biasa.

## 5. GET /places/bbox

Digunakan untuk marker sesuai viewport peta.

### Query parameters

| Parameter | Tipe | Required | Default backend |
|---|---|---:|---|
| `north` | number | No | `-6.500` |
| `south` | number | No | `-6.680` |
| `east` | number | No | `106.860` |
| `west` | number | No | `106.720` |
| Semua filter dari `/places` | mixed | No | — |
| `limit` | integer | No | 100 |
| `sort_by` | string | No | `nugas_score` |
| `order` | string | No | `desc` |

### Response

GeoJSON `FeatureCollection`:

```json
{
  "type": "FeatureCollection",
  "metadata": {
    "count": 1,
    "city": "Kota Bogor",
    "generated_at": "..."
  },
  "features": [
    {
      "type": "Feature",
      "id": 1,
      "geometry": {
        "type": "Point",
        "coordinates": [106.79, -6.59]
      },
      "properties": {
        "id": 1,
        "name": "Contoh Cafe",
        "slug": "contoh-cafe",
        "subdistrict": "Bogor Tengah",
        "address": "...",
        "price_min_drink": 15000,
        "wifi_speed_mbps": 50,
        "wifi_quality": "fast",
        "plug_availability": "abundant",
        "noise_level": "quiet",
        "is_24_hours": false,
        "google_rating": 4.7,
        "nugas_score": 90,
        "budget_score": 85,
        "facility_score": 95,
        "image_url": "https://...",
        "vibe_tags": ["Tenang", "Banyak Colokan"],
        "google_maps_url": "...",
        "instagram_handle": "@contohcafe",
        "distance_km": null
      }
    }
  ]
}
```

## 6. GET /places/nearby

### Query parameters

| Parameter | Tipe | Required | Default |
|---|---|---:|---|
| `lat` | number | No | pusat Bogor |
| `lng` | number | No | pusat Bogor |
| `radius_km` | number | No | 10 km |
| `limit` | integer | No | 50 |
| Filter lain | mixed | No | — |

`lat` dan `lng` yang dikirim bersama digunakan untuk perhitungan Haversine. Response sama-sama berupa GeoJSON `FeatureCollection`, dengan `distance_km` pada properties.

## 7. GET /places/recommend

### Query parameters

| Parameter | Tipe | Required | Default |
|---|---|---:|---|
| `w_budget` | number | No | 0.35 |
| `w_wifi` | number | No | 0.25 |
| `w_plug` | number | No | 0.25 |
| `w_quiet` | number | No | 0.15 |
| `lat` | number | No | — |
| `lng` | number | No | — |
| `limit` | integer | No | 20 |
| Filter `/places` | mixed | No | — |

### Response

```json
{
  "status": "success",
  "message": "Rekomendasi tempat nugas teratas di Kota Bogor berdasarkan preferensi Anda",
  "data": [
    {
      "type": "Feature",
      "id": 1,
      "geometry": { "type": "Point", "coordinates": [106.79, -6.59] },
      "properties": {
        "...": "PlaceGeoJsonResource fields",
        "distance_km": 1.2
      }
    }
  ]
}
```

> **Catatan penting:** source backend menghitung `custom_recommendation_score`, tetapi `PlaceGeoJsonResource` tidak mengekspos field tersebut. Jika UI membutuhkan skor rekomendasi, backend perlu menambahkan field itu ke resource.

## 8. GET /places/{idOrSlug}

Mengambil detail tempat berdasarkan ID atau slug.

### Response shape

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Contoh Cafe",
    "slug": "contoh-cafe",
    "description": "...",
    "category": { "id": 1, "name": "Cafe", "slug": "cafe", "icon": "coffee" },
    "location": {
      "address": "...",
      "subdistrict": "Bogor Tengah",
      "latitude": -6.59,
      "longitude": 106.79,
      "google_maps_url": "...",
      "navigation_url": "..."
    },
    "socials": {
      "instagram": "https://instagram.com/contohcafe",
      "instagram_handle": "@contohcafe"
    },
    "economics": { "...": "..." },
    "nugas_metrics": { "...": "..." },
    "operational": { "...": "..." },
    "ratings": { "...": "..." },
    "media": { "image_url": "...", "vibe_tags": [] },
    "amenities": [],
    "reviews_summary": []
  }
}
```

## 9. GET /categories

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Cafe",
      "slug": "cozy-coffee-shop",
      "icon": "coffee",
      "description": "...",
      "places_count": 5
    }
  ]
}
```

## 10. GET /amenities

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Wi-Fi Cepat",
      "slug": "wifi-cepat",
      "icon": "wifi",
      "group": "workspace",
      "places_count": 8
    }
  ]
}
```

## 11. GET /places/subdistricts

```json
{
  "status": "success",
  "data": [
    { "subdistrict": "Bogor Barat", "count": 3 },
    { "subdistrict": "Bogor Tengah", "count": 5 }
  ]
}
```

## 12. POST /contributions — Add New Study Place

Endpoint ini adalah endpoint yang paling dekat dengan halaman **Add & Recommend New Study Place**.

### Request

`POST /api/v1/contributions`

Content-Type: `application/json`

| Field | Tipe | Required | Keterangan |
|---|---|---:|---|
| `name` | string | Yes | Nama tempat |
| `address` | string | Yes | Alamat |
| `subdistrict` | string | Yes | Kecamatan |
| `latitude` | number | Yes | -90 sampai 90 |
| `longitude` | number | Yes | -180 sampai 180 |
| `price_min_drink` | integer | No | Harga minimum minuman |
| `wifi_speed_mbps` | integer | No | Kecepatan Wi-Fi |
| `plug_availability` | enum | No | `none`, `limited`, `moderate`, `abundant` |
| `noise_level` | enum | No | `quiet`, `moderate`, `lively` |
| `is_24_hours` | boolean | No | Default false di database |
| `notes` | string | No | Maks. 1000 karakter |
| `submitter_name` | string | No | Maks. 100 karakter |
| `submitter_email` | email | No | Maks. 150 karakter |

### Response 201

```json
{
  "status": "success",
  "message": "Terima kasih! Kontribusi tempat nugas baru berhasil dikirim dan akan diverifikasi oleh tim Go Around.",
  "data": {
    "id": 1,
    "name": "Cafe Baru",
    "status": "pending",
    "created_at": "2026-09-14T00:00:00+00:00"
  }
}
```

### Validation error

Laravel akan mengembalikan HTTP `422 Unprocessable Entity` untuk payload yang gagal validasi.

## 13. Report & Correct Cafe Facilities — GAP

Halaman frontend yang direncanakan membutuhkan user untuk melaporkan/mengoreksi fasilitas cafe yang sudah ada, misalnya:

- Wi-Fi salah/tidak sesuai
- jumlah/ketersediaan colokan salah
- tingkat kebisingan salah
- jam buka salah
- fasilitas/amenity salah
- data tempat lain perlu dikoreksi

**Backend saat ini belum menyediakan endpoint, model, migration, atau controller khusus untuk kebutuhan tersebut.**

[ASUMSI - perlu dikonfirmasi] Untuk tahap frontend sekarang, halaman report dapat dibuat UI terlebih dahulu tetapi submit belum dapat diintegrasikan sampai backend menyediakan kontrak endpoint.

## 14. Authentication & Authorization

### Hasil audit

Tidak ditemukan middleware auth pada `routes/api.php`. Semua endpoint yang didefinisikan di bawah `/api/v1` dapat diakses tanpa token/login berdasarkan routing yang tersedia.

Laravel memang memiliki konfigurasi guard `web` berbasis session dan model `User`, tetapi konfigurasi tersebut **bukan berarti API sudah memiliki authentication**. Tidak ada endpoint login/register API dan tidak ada `auth:*` middleware pada route API yang diaudit.

[ASUMSI - perlu dikonfirmasi] Untuk frontend user-facing tahap sekarang, anggap seluruh endpoint publik dan tidak perlu login. Authentication/authorization untuk admin dikeluarkan dari scope saat ini.

## 15. Image Upload & Cloudinary

Backend contribution tidak memiliki field gambar/image URL dan controller hanya memvalidasi field data tempat/fasilitas/submitter.

Artinya:

1. Frontend boleh menggunakan Cloudinary untuk upload foto sebagai kebutuhan UI.
2. **URL hasil upload Cloudinary belum bisa dikirim dan disimpan oleh `/contributions` tanpa perubahan backend.**
3. Jangan mengirim file multipart ke `/contributions` karena controller saat ini tidak mengharapkan field file.

[ASUMSI - perlu dikonfirmasi] Untuk frontend milestone sekarang, Cloudinary disiapkan sesuai requirement, tetapi integrasi penyimpanan URL ke backend ditunda sampai kontrak backend diperbarui.

## 16. Frontend Integration Recommendation

### Home

Prioritas:

1. `GET /places/bbox` untuk marker berdasarkan viewport.
2. `GET /places` untuk sidebar/list dengan pagination/filter.
3. `GET /places/{idOrSlug}` ketika user membuka detail.
4. `GET /categories` dan `GET /amenities` untuk metadata filter.
5. `GET /places/subdistricts` bila filter kecamatan diperlukan.
6. `GET /places/nearby` bila fitur lokasi terdekat dipakai.

### Add & Recommend New Study Place

Gunakan `POST /contributions`.

Frontend harus mengirim JSON, bukan multipart file upload.

### Report & Correct Cafe Facilities

Belum dapat dibuat sebagai integrasi API penuh karena endpoint backend belum ada.

## 17. Mismatch yang Perlu Dicatat Sebelum Coding

### Mismatch A — Report facility

**Frontend requirement:** report/correct fasilitas cafe.

**Backend:** belum ada endpoint.

**Action:** perlu endpoint baru pada backend sebelum form dapat benar-benar submit.

### Mismatch B — Cloudinary image URL

**Frontend requirement:** upload image via Cloudinary lalu mengirim URL.

**Backend:** `contributions` tidak mempunyai `image_url` dan controller tidak memvalidasinya.

**Action:** backend perlu menambah field `image_url` jika foto kontribusi memang harus disimpan.

### Mismatch C — List response vs GeoJSON

`GET /places` mengembalikan model data biasa, sedangkan `/places/bbox`, `/places/nearby`, dan recommendation memakai format GeoJSON.

**Action:** frontend perlu memiliki dua tipe response: `PlaceListItem` dan `GeoJsonFeature<PlaceProperties>`.

### Mismatch D — Recommendation score

Backend menghitung `custom_recommendation_score`, tetapi tidak memasukkannya ke `PlaceGeoJsonResource`.

**Action:** jika UI menampilkan skor rekomendasi, backend perlu mengekspos field tersebut.

### Mismatch E — Validasi bbox

`/places/bbox` belum melakukan validation eksplisit untuk `north`, `south`, `east`, `west`, dan `limit`.

**Action:** frontend tetap mengirim nilai Leaflet yang valid; backend sebaiknya menambahkan validation sebelum production.

## 18. Status untuk Frontend Milestone

- [x] Endpoint daftar tempat ditemukan
- [x] Endpoint detail tempat ditemukan
- [x] Endpoint map viewport ditemukan
- [x] Endpoint nearby ditemukan
- [x] Endpoint recommendation ditemukan
- [x] Endpoint metadata kategori ditemukan
- [x] Endpoint metadata amenity ditemukan
- [x] Endpoint add new place ditemukan
- [ ] Endpoint report/correct facility belum tersedia
- [ ] Image URL Cloudinary belum didukung contribution
- [x] Authentication publik: tidak diperlukan berdasarkan route saat ini
- [ ] Admin auth: belum ada dan di luar scope sekarang
