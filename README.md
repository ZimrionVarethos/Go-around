# Go Around — WebGIS for Student-Friendly Study Spaces and Cafes in Bogor City

Go Around is a WebGIS-based platform designed to help students find and explore cafes and study-friendly places in Bogor City.

The frontend provides an interactive map, place discovery, filtering, place details, facility reporting, and recommendations for new study places.

## Frontend

The frontend is built as a modern responsive web application based on the provided Figma design.

### Main Features

* Interactive WebGIS map for exploring study places and cafes
* Search places by name or keyword
* Filter places based on:

  * Subdistrict
  * Category
  * Price range
  * Wi-Fi speed
  * Plug availability
  * Noise level
  * 24-hour availability
  * Student discount
  * Amenities
* Display recommended places
* Display place details including:

  * Location
  * Price information
  * Wi-Fi
  * Plug availability
  * Noise level
  * Operating hours
  * Ratings
  * Amenities
  * Social media
  * Images
* Report and correct cafe facility information
* Add and recommend a new study place
* Responsive layout for desktop, tablet, and mobile
* Reusable UI components
* Integration with the existing Laravel REST API

### Technology Stack

* **Next.js 16.x** — React framework
* **React 19.2**
* **TypeScript**
* **Tailwind CSS 4**
* **TanStack Query 5** — server-state and API data management
* **React Leaflet 5** — interactive map integration
* **Leaflet**
* **OpenStreetMap** — map tiles/data source
* **Lucide React** — icons
* **Cloudinary** — image upload

> Use the latest stable release within the Next.js 16.x Active LTS line. Do not use canary releases.

## Backend

The frontend consumes the existing Laravel REST API located in:

```text
backend/go-around/
```

The backend is responsible for place data, spatial search, recommendations, categories, amenities, and place contributions.

### Backend Stack

* Laravel 13
* PHP 8.3+
* REST API
* Spatial/geographic data support

The frontend must follow the existing API contract documented in:

```text
frontend/docs/api-contract.md
```

The frontend must **not invent new API endpoints** when a required feature is not currently supported by the backend.

If a Figma feature requires backend functionality that does not exist, document the dependency instead of creating a fake API integration.

## Design System

The visual implementation follows the provided Figma designs as the primary source of truth.

Supporting design documentation:

```text
frontend/docs/design-tokens.md
frontend/docs/figma-screens.md
```

### Design Rules

1. Figma is the primary visual source of truth.
2. `design-tokens.md` provides supporting design-system guidance.
3. `api-contract.md` is the source of truth for existing backend API behavior.
4. Do not replace the Figma design with a generic dashboard or template UI.
5. Build reusable components instead of duplicating UI structures.
6. Preserve the visual hierarchy, spacing, typography, colors, states, and responsive behavior shown in Figma.
7. The interface uses Indonesian for user-facing content unless the design specifies otherwise.

## Figma Reference

The project uses the provided Figma design as the main implementation reference.

The Figma screen references are documented in:

```text
frontend/docs/figma-screens.md
```

There are 13 provided Figma nodes that must be inspected individually during implementation.

A Figma node does not necessarily represent a separate route. It may represent a page, modal, state, component, or another UI composition.

## Frontend Structure

The frontend should be organized around reusable components and feature-based UI rather than putting everything into a single page component.

A suggested structure:

```text
frontend/
├── app/
├── components/
├── features/
├── lib/
├── hooks/
├── types/
├── public/
└── docs/
    ├── api-contract.md
    ├── design-tokens.md
    └── figma-screens.md
```

The exact implementation structure may be adjusted by the coding agent when it provides a clear architectural reason.

## API Configuration

Create the frontend environment configuration using:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

Cloudinary is intended for frontend image uploads.

However, the current backend contribution API does not persist an `image_url` field. Therefore, the frontend must not assume that uploaded images can currently be stored with a contribution unless the backend is updated separately.

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

Run the Laravel backend separately from:

```text
backend/go-around/
```

## Important Implementation Constraints

* Do not modify the existing backend unless explicitly requested.
* Do not create fake API endpoints.
* Do not hardcode place data when the corresponding API endpoint exists.
* Do not create an authentication system unless it is supported by the project requirements.
* Do not assume every Figma node is a separate page.
* Inspect all provided Figma nodes before implementing their corresponding UI.
* Keep map functionality integrated with the existing backend spatial endpoints.
* Use reusable components and typed API responses.
* Ensure the application is responsive.
* Match the Figma design rather than creating an unrelated visual style.

## Documentation

| Document                | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `docs/api-contract.md`  | Existing Laravel API behavior and response contracts |
| `docs/design-tokens.md` | Supporting visual/design-system documentation        |
| `docs/figma-screens.md` | Figma file and node references                       |

## Project Principle

**Figma defines how the application should look.**

**The existing API contract defines what the frontend can currently consume.**

When the two require functionality that does not currently exist in the backend, report the dependency rather than inventing backend behavior.
