# Go Around: WebGIS for Student-Friendly Study Spaces and Cafes in Bogor City

Go Around is an interactive Geographic Information System (WebGIS) platform engineered specifically to help university students and digital nomads locate the most suitable, budget-friendly study spaces, 24-hour modern warkops, and coworking cafes across Bogor City (Kota Bogor, West Java, Indonesia).

---

## 1. Project Overview

Students in Bogor frequently face difficulties finding spots that meet their specific academic needs. Critical details such as Wi-Fi reliability, power outlet availability, noise levels, 24-hour operational status, and price ranges are scattered across fragmented platforms without standardized metrics.

Go Around centralizes geospatial data, Google Places metadata, and social reviews into an interactive dark cartography WebGIS interface powered by a weighted multi-criteria recommendation scoring algorithm.

---

## 2. Key Capabilities

* **Dark Cartography WebGIS Interface**:
  * Built using Leaflet and Carto Dark Matter cartography inspired by mapcn.dev.
  * Category-based glowing neon vector coffee pin markers (Green for Budget Warkop, Cyan for Cozy Cafe, Purple for Coworking).
  * Smooth hover tooltips and rich glassmorphism detail popups with navigation routes.

* **Browser Geolocation and Radar Proximity Search**:
  * Real-time GPS location detection using native browser geolocation APIs.
  * Animated sonar radar wave scanning visualization centered on the user coordinates.
  * Haversine formula distance computation with instant radius filtering (under 1 KM, under 3 KM, under 5 KM).
  * Graceful fallback and error messaging when location services are denied or unavailable.

* **Weighted Multi-Criteria Recommendation Engine**:
  * Calculates an aggregate **Nugas Score** (0 to 100) combining four weighted dimensions:
    1. Budget Score (Weight: 35%): Drink entry price and student discount availability.
    2. Facility Score (Weight: 30%): Wi-Fi speed (Mbps), power outlet accessibility, and 24-hour operation.
    3. Comfort Score (Weight: 20%): Ambient noise level, seating ergonomics, and AC status.
    4. Popularity Score (Weight: 15%): Google rating and verified community review volume.

* **Interactive Spatial and Attribute Filters**:
  * Administrative subdistrict filtering (Bogor Tengah, Bogor Timur, Bogor Utara, Bogor Selatan, Bogor Barat, Tanah Sareal).
  * Fast attribute filtering by maximum price, minimum Wi-Fi speed, outlet density, noise preferences, and 24-hour operation.
  * Multi-attribute sorting by Nugas Score, lowest price, highest facility rating, or proximity distance.

---

## 3. Technology Stack and Architecture

The platform is architected as a decoupled client-server system:

### Frontend
* **Framework**: Next.js 14 (App Router) with React and TypeScript.
* **Styling**: Tailwind CSS with custom Dark Matter theme.
* **Typography**: Syne (geometric bold headlines and numbers) and DM Sans (clean body copy).
* **Mapping**: Leaflet with dynamic client-side SSR hydration guards.
* **Icons**: Lucide React (standardized SVG icons with zero emojis).
* **Deployment**: Optimized for zero-configuration deployment on Vercel.

### Backend
* **Framework**: Laravel 11 (PHP 8.2+).
* **Database**: MySQL with spatial coordinate indexing.
* **Standards**: RFC 7946 GeoJSON FeatureCollection format with WGS84 spatial reference (EPSG:4326).
* **Security**: Supply chain hardened with strict script execution policies and sanitization guards.

---

## 4. Repository Structure

```
Proyekweb/
├── backend/
│   └── go-around/          # Laravel 11 REST API application
│       ├── app/            # Controllers, Eloquent Models, and Spatial Services
│       ├── database/       # Migrations and Kota Bogor realistic seeders
│       ├── routes/         # API endpoint definitions (routes/api.php)
│       └── api.md          # REST API technical specification
├── frontend/               # Next.js 14 WebGIS frontend application
│   ├── src/
│   │   ├── app/            # Next.js App Router (layout.tsx, page.tsx, globals.css)
│   │   ├── components/     # UI components (MapInner, Navbar, PlaceCard, Modals)
│   │   ├── services/       # API client with zero-crash local mock fallback
│   │   └── types/          # TypeScript definitions for places and GeoJSON
│   └── package.json
├── plan.md                 # Architecture, ML roadmap, and security blueprint
├── SKILL.md                # GIS standards, spatial SQL, and developer reference
├── api.md                  # Complete REST API reference documentation
├── .gitignore              # Global git ignore configuration
└── README.md               # Master project documentation
```

---

## 5. Getting Started

### Prerequisites
* Node.js v18.0+ or v22.0+
* PHP 8.2+ with Composer (for backend development)
* MySQL 8.0+ (optional for local database execution)

### 1. Running the Frontend

The frontend is equipped with an automatic fallback dataset containing verified Bogor City locations. It can be run independently without requiring an active backend server:

```bash
cd frontend
npm install
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

To create an optimized production build:
```bash
npm run build
npm run start
```

### 2. Setting Up the Laravel Backend (Optional)

1. Navigate to the backend directory:
   ```bash
   cd backend/go-around
   composer install
   ```

2. Configure environment variables in `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=goaround
   DB_USERNAME=root
   DB_PASSWORD=
   ```

3. Run migrations and database seeders:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

4. Calculate spatial recommendation scores:
   ```bash
   php artisan places:calculate-scores
   ```

5. Start the local development server:
   ```bash
   php artisan serve
   ```
   The API will be available at `http://127.0.0.1:8000/api/v1/places`.

---

## 6. Security and Supply Chain Standards

* Package installation is restricted using `ignore-scripts=true` and strict lockfile audit controls.
* All external dependencies avoid compromised npm packages and supply chain vectors.
* Input queries and bounding boxes are sanitized against SQL injection using parameterized spatial bindings.

---

## 7. License

This project is open-source and available under the MIT License.
