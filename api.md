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
* **Contoh Response**:
  ```json
  {
    "status": "healthy",
    "app": "Go Around - WebGIS Nugas Ramah Kantong Mahasiswa (Kota Bogor)",
    "version": "1.0.0",
    "timestamp": "2026-08-26T17:45:00+07:00"
  }
  ```

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

* **Contoh Request**:
  ```http
  GET /api/v1/places?subdistrict=Bogor Tengah&max_price=20000&plug_availability=abundant&sort_by=nugas_score
  ```

---

### 3.3 Viewport Bounding Box (`/places/bbox`)
* **Endpoint**: `GET /places/bbox`
* **Kegunaan**: Digunakan langsung oleh library peta (Leaflet / MapLibre / Mapbox) saat peta digeser (*drag/pan*) atau di-zoom.
* **Query Parameters**:
  * `north`: Batas lintang utara (default: `-6.500`)
  * `south`: Batas lintang selatan (default: `-6.680`)
  * `east`: Batas bujur timur (default: `106.860`)
  * `west`: Batas bujur barat (default: `106.720`)
  * *(Semua parameter filter pada 3.2 juga bisa digabungkan)*

* **Format Response (RFC 7946 GeoJSON Standard)**:
  ```json
  {
    "type": "FeatureCollection",
    "metadata": {
      "count": 14,
      "city": "Kota Bogor",
      "generated_at": "2026-08-26T17:45:00+07:00"
    },
    "features": [
      {
        "type": "Feature",
        "id": 1,
        "geometry": {
          "type": "Point",
          "coordinates": [106.79981, -6.59124]
        },
        "properties": {
          "id": 1,
          "name": "Maraca Books and Coffee",
          "slug": "maraca-books-and-coffee",
          "subdistrict": "Bogor Tengah",
          "address": "Jl. Jalak Harupat No.9a, Babakan, Kota Bogor",
          "price_min_drink": 18000,
          "price_tier": 2,
          "wifi_speed_mbps": 45,
          "plug_availability": "abundant",
          "noise_level": "quiet",
          "is_24_hours": false,
          "nugas_score": 92.5,
          "budget_score": 82.0,
          "facility_score": 94.0,
          "image_url": "https://images.unsplash.com/...",
          "vibe_tags": ["Quiet", "Book Cafe", "Colokan Tiap Meja", "Skripsi Spot"]
        }
      }
    ]
  }
  ```

---

### 3.4 Nearby Radius Search (`/places/nearby`)
* **Endpoint**: `GET /places/nearby`
* **Kegunaan**: Menampilkan tempat nugas dalam radius jarak tertentu dari posisi GPS pengguna (menggunakan kalkulasi presisi Haversine).
* **Query Parameters**:
  * `lat`: Latitude lokasi user (contoh: `-6.595038`).
  * `lng`: Longitude lokasi user (contoh: `106.790082`).
  * `radius_km`: Jarak radius pencarian dalam KM (default: `10`, contoh: `3.5`).
  * `limit`: Jumlah maksimal hasil (default: `50`).

* **Format Response**: Mengembalikan `FeatureCollection` GeoJSON dengan properti tambahan `distance_km` di setiap feature.

---

### 3.5 Personalized Smart Recommendation (`/places/recommend`)
* **Endpoint**: `GET /places/recommend`
* **Kegunaan**: Memberikan rekomendasi berperingkat berdasarkan bobot prioritas yang diatur pengguna (misal: slider prioritas mahasiswa).
* **Query Parameters**:
  * `w_budget`: Bobot prioritas harga murah (0.0 - 1.0, default: `0.35`).
  * `w_wifi`: Bobot prioritas internet kencang (0.0 - 1.0, default: `0.25`).
  * `w_plug`: Bobot prioritas ketersediaan colokan (0.0 - 1.0, default: `0.25`).
  * `w_quiet`: Bobot prioritas keheningan/ketenangan (0.0 - 1.0, default: `0.15`).
  * `lat` & `lng`: *(Opsional)* Koordinat user jika ingin memperhitungkan faktor jarak (distance penalty).

---

### 3.6 Detail Tempat Lengkap (`/places/{idOrSlug}`)
* **Endpoint**: `GET /places/maraca-books-and-coffee` atau `GET /places/1`
* **Kegunaan**: Menampilkan profil lengkap tempat, foto, fasilitas, ulasan sentimen, serta link langsung navigasi Google Maps.
* **Contoh Response**:
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "name": "Maraca Books and Coffee",
      "slug": "maraca-books-and-coffee",
      "description": "Tempat nugas favorit mahasiswa IPB & Pakuan. Koleksi buku lengkap, suasana hening, colokan di tiap meja...",
      "category": {
        "id": 4,
        "name": "Library & Quiet Cafe",
        "slug": "library-quiet-cafe",
        "icon": "book-open"
      },
      "location": {
        "address": "Jl. Jalak Harupat No.9a, Babakan, Kecamatan Bogor Tengah, Kota Bogor",
        "subdistrict": "Bogor Tengah",
        "latitude": -6.59124,
        "longitude": 106.79981,
        "google_maps_url": "https://maps.app.goo.gl/maraca-bogor",
        "navigation_url": "https://www.google.com/maps/dir/?api=1&destination=-6.59124,106.79981"
      },
      "socials": {
        "instagram": "https://instagram.com/maracacoffee",
        "instagram_handle": "@maracacoffee"
      },
      "economics": {
        "price_min_drink": 18000,
        "price_max_drink": 32000,
        "price_avg_food": 25000,
        "price_tier": 2,
        "price_tier_label": "Standar / Menengah (15rb - 28rb)",
        "parking_fee_motor": 2000,
        "has_student_discount": true
      },
      "nugas_metrics": {
        "nugas_score": 92.5,
        "budget_score": 82.0,
        "facility_score": 94.0,
        "wifi_speed_mbps": 45,
        "wifi_quality": "fast",
        "plug_availability": "abundant",
        "plug_label": "Banyak (Hampir di setiap meja)",
        "noise_level": "quiet",
        "noise_label": "Tenang & Hening (Ideal Skripsi / Deep Work)"
      },
      "operational": {
        "is_24_hours": false,
        "open_time": "08:00:00",
        "close_time": "22:00:00",
        "formatted_hours": "08:00:00 - 22:00:00"
      },
      "ratings": {
        "google_rating": 4.7,
        "total_google_reviews": 1250
      },
      "amenities": [
        {
          "id": 1,
          "name": "Colokan Melimpah",
          "slug": "colokan-melimpah",
          "icon": "plug",
          "group": "workspace",
          "detail": "Tersedia di lokasi"
        }
      ],
      "reviews_summary": [
        {
          "id": 1,
          "reviewer_name": "Adit P.",
          "rating": 5.0,
          "comment": "Tempat paling tenang buat garap skripsi di Bogor...",
          "keywords": ["tenang", "skripsi", "wifi kenceng", "colokan"],
          "sentiment": "positive",
          "date": "26 Aug 2026"
        }
      ]
    }
  }
  ```

---

### 3.7 Metadata Kategori & Fasilitas
* **`GET /categories`**: Mengembalikan daftar kategori beserta jumlah tempat aktif (`places_count`).
* **`GET /amenities`**: Mengembalikan daftar fasilitas (amenities) beserta kelompok fasilitasnya (`group`: `workspace`, `facility`, `economy`).
* **`GET /places/subdistricts`**: Mengembalikan daftar 6 kecamatan di Kota Bogor beserta jumlah tempat terdaftar.

---

### 3.8 Submit Kontribusi Komunitas (`POST /contributions`)
* **Endpoint**: `POST /contributions`
* **Request Body (JSON)**:
  ```json
  {
    "name": "Warkop Masa Kini IPB",
    "address": "Jl. Babakan Tengah No.10, Dramaga",
    "subdistrict": "Bogor Barat",
    "latitude": -6.561234,
    "longitude": 106.741234,
    "price_min_drink": 8000,
    "wifi_speed_mbps": 50,
    "plug_availability": "abundant",
    "noise_level": "moderate",
    "is_24_hours": true,
    "notes": "Colokan ada di setiap sudut, indomie dokdok enak",
    "submitter_name": "Fikri",
    "submitter_email": "fikri@student.ipb.ac.id"
  }
  ```
* **Response Status**: `201 Created`

---

## 4. Contoh Pemanggilan (Frontend Integration)

### 4.1 Menggunakan Native `fetch` (Aman dari Masalah Supply Chain Axios/Node)
```javascript
// Contoh pemanggilan Nearby API dengan Web API Native Fetch:
async function fetchNearbyPlaces(userLat, userLng, radiusKm = 5) {
  try {
    const params = new URLSearchParams({
      lat: userLat,
      lng: userLng,
      radius_km: radiusKm,
      plug_availability: 'abundant',
    });

    const response = await fetch(`http://127.0.0.1:8000/api/v1/places/nearby?${params}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const geojsonData = await response.json();
    console.log('Daftar tempat terdekat (GeoJSON):', geojsonData);
    return geojsonData;
  } catch (error) {
    console.error('Gagal mengambil data:', error);
  }
}
```

### 4.2 Integrasi Langsung dengan Leaflet Map Layer
```javascript
// Menampilkan titik coffee shop langsung ke Leaflet map
fetch('http://127.0.0.1:8000/api/v1/places/bbox')
  .then(res => res.json())
  .then(geoJson => {
    L.geoJSON(geoJson, {
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layer.bindPopup(`
          <div class="font-sans">
            <h3 class="font-bold text-base">${p.name}</h3>
            <p class="text-xs text-gray-500">${p.subdistrict}</p>
            <div class="mt-2 text-sm">
              <span class="badge bg-green-100 text-green-800">Skor Nugas: ${p.nugas_score}</span>
              <span class="badge bg-blue-100 text-blue-800">Wi-Fi: ${p.wifi_speed_mbps} Mbps</span>
            </div>
            <p class="mt-1 text-xs">Mulai Rp ${p.price_min_drink.toLocaleString('id-ID')}</p>
            <a href="/place/${p.slug}" class="text-blue-600 underline text-xs mt-2 block">Lihat Detail & Navigasi &rarr;</a>
          </div>
        `);
      }
    }).addTo(map);
  });
```
