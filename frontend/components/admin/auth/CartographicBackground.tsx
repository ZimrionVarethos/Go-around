'use client';

/**
 * Cartographic Topographic Contour & Coordinate Grid Background
 * Digunakan sebagai latar belakang visual bertema WebGIS Kota Bogor pada halaman Admin Login.
 */
export function CartographicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Minor & Major Spatial Grid Lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 91, 84, 0.065) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 91, 84, 0.065) 1px, transparent 1px),
            linear-gradient(to right, rgba(0, 91, 84, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 91, 84, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '96px 96px, 96px 96px, 24px 24px, 24px 24px',
        }}
      />

      {/* 2. Vector Topographic Elevation Contours & Survey Crosshairs */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Topographic Contour Lines — Bogor Basin Inspired */}
        <g stroke="#005B54" strokeOpacity="0.11" strokeWidth="1.1">
          <path d="M-120 180 C 180 120, 340 290, 620 210 C 900 130, 1120 40, 1560 150" />
          <path d="M-120 260 C 210 190, 390 360, 670 270 C 950 180, 1150 110, 1560 230" />
          <path
            d="M-120 350 C 240 270, 430 430, 720 340 C 1010 250, 1190 190, 1560 320"
            strokeDasharray="6 6"
          />
          <path d="M-100 580 C 220 490, 480 670, 790 560 C 1080 460, 1260 520, 1560 440" />
          <path d="M-100 660 C 250 560, 520 740, 830 640 C 1120 540, 1290 610, 1560 530" />
          <path d="M-100 750 C 290 650, 560 820, 880 720 C 1160 630, 1320 700, 1560 630" />
        </g>

        {/* Nested Elevation Rings (Top-Left & Bottom-Right Catchments) */}
        <g stroke="#005B54" strokeOpacity="0.09" strokeWidth="1">
          <ellipse cx="220" cy="210" rx="230" ry="125" transform="rotate(-12 220 210)" />
          <ellipse cx="220" cy="210" rx="160" ry="85" transform="rotate(-12 220 210)" />
          <ellipse cx="220" cy="210" rx="95" ry="48" transform="rotate(-12 220 210)" />

          <ellipse cx="1210" cy="690" rx="260" ry="145" transform="rotate(-8 1210 690)" />
          <ellipse cx="1210" cy="690" rx="185" ry="100" transform="rotate(-8 1210 690)" />
          <ellipse cx="1210" cy="690" rx="110" ry="56" transform="rotate(-8 1210 690)" />
        </g>

        {/* Center Spatial Isochrone Reference Ring Behind Card */}
        <g stroke="#005B54" strokeOpacity="0.12" strokeWidth="1">
          <circle cx="720" cy="450" r="290" strokeDasharray="4 6" />
          <circle cx="720" cy="450" r="390" strokeOpacity="0.07" />
        </g>

        {/* Survey Crosshair Ticks (+) */}
        <g stroke="#005B54" strokeOpacity="0.24" strokeWidth="1.2" strokeLinecap="round">
          <path d="M288 187 V197 M283 192 H293" />
          <path d="M1152 187 V197 M1147 192 H1157" />
          <path d="M288 667 V677 M283 672 H293" />
          <path d="M1152 667 V677 M1147 672 H1157" />
          <path d="M480 379 V389 M475 384 H485" />
          <path d="M960 571 V581 M955 576 H965" />
        </g>

        {/* Subtle Cartographic Elevation & Buffer Annotations */}
        <g
          fill="#005B54"
          fillOpacity="0.32"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="10"
          letterSpacing="0.06em"
        >
          <text x="195" y="122">
            ELV +265m
          </text>
          <text x="1165" y="585">
            ELV +290m
          </text>
          <text x="955" y="255">
            R = 1.000m BUFFER
          </text>
        </g>
      </svg>

      {/* 3. Ambient Teal Focal Glow Behind Login Card & Soft Edge Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle 420px at 50% 50%, rgba(0, 91, 84, 0.075), transparent 70%),
            radial-gradient(ellipse 90% 85% at 50% 50%, transparent 55%, rgba(242, 244, 240, 0.85) 100%)
          `,
        }}
      />
    </div>
  );
}
