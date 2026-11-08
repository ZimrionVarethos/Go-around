# Go Around --- Design Tokens

> Sumber: `go-around-ui.pdf`, khusus halaman user-facing: Home / WebGIS,
> Lapor & Koreksi Fasilitas, dan Tambah & Rekomendasikan Tempat Nugas
> Baru.
>
> Catatan: token di bawah diturunkan dari tampilan visual PDF. Nilai
> warna yang dapat dibaca dari hasil render dicatat sebagai **visual
> estimate**; ukuran font/spacing yang tidak memiliki spesifikasi
> eksplisit di PDF dicatat sebagai **perkiraan visual**, bukan angka
> Figma yang pasti.

## 1. Brand & Color

### Primary

  -----------------------------------------------------------------------
  Token                   Nilai visual            Penggunaan
  ----------------------- ----------------------- -----------------------
  `--color-primary-900`   `#005B54`               Tombol utama,
                                                  header/button CTA,
                                                  heading teal, selected
                                                  state

  `--color-primary-700`   `#0F756E`               Variasi teal pada icon,
                                                  border, accent

  `--color-primary-500`   `#059569`               Status positif, badge,
                                                  icon, success accent

  `--color-primary-100`   `#E6F4EF`               Background badge /
                                                  selected-soft

  `--color-primary-50`    `#EFFBF6`               Background area
                                                  informasi positif
  -----------------------------------------------------------------------

### Neutral

  ----------------------------------------------------------------------------
  Token                        Nilai visual            Penggunaan
  ---------------------------- ----------------------- -----------------------
  `--color-text-900`           `#131A2D`               Heading dan text utama

  `--color-text-700`           `#3D6053`               Text sekunder yang
                                                       lebih gelap /
                                                       teal-neutral

  `--color-text-500`           `#6E7977`               Caption, metadata,
                                                       helper text

  `--color-border`             `#DDE3E1`               Border card, input,
                                                       divider

  `--color-surface`            `#FFFFFF`               Card, form, modal

  `--color-background`         `#F6F4ED`               Background area utama
                                                       Home/map

  `--color-background-soft`    `#F2F2F6`               Background soft pada
                                                       beberapa control

  `--color-background-green`   `#E6F4EF`               Footer / success /
                                                       verification area
  ----------------------------------------------------------------------------

### Semantic

  -----------------------------------------------------------------------
  Token                   Nilai visual            Penggunaan
  ----------------------- ----------------------- -----------------------
  `--color-success`       `#0FB880`               Terverifikasi, selesai,
                                                  status positif

  `--color-warning`       `#F49E0A`               Harga, perhatian,
                                                  sedang divalidasi

  `--color-danger`        `#D8261A`               Laporan, error,
                                                  fasilitas bermasalah

  `--color-info`          `#37B8F2`               Informasi / data
                                                  spasial

  `--color-yellow`        `#FFDD00`               CTA "Buy me a coffee",
                                                  highlight tertentu
  -----------------------------------------------------------------------

### Map score colors

Legenda Home menunjukkan empat kategori skor kesesuaian:

  Range          Visual
  -------------- ------------
  `0.9 – 1.0`    Hijau
  `0.8 – 0.89`   Hijau muda
  `0.6 – 0.79`   Oranye
  `< 0.6`        Merah

Warna map tidak dianggap sebagai global UI token karena berasal dari
layer kartografi.

## 2. Typography

### Visual hierarchy

Desain menggunakan **Onest** dengan karakter modern/geometris. Nama
font spesifik tidak dapat dipastikan dari PDF sehingga **jangan mengunci
font tertentu berdasarkan asumsi**.

  Token                     Perkiraan visual Penggunaan
  ----------------------- ------------------ -------------------------
  `--font-size-display`            28--32 px Heading utama halaman
  `--font-size-h1`                 24--28 px Heading besar
  `--font-size-h2`                 18--20 px Section/card heading
  `--font-size-h3`                 15--17 px Judul card / subsection
  `--font-size-body`               13--14 px Body text
  `--font-size-small`              11--12 px Metadata / helper
  `--font-size-caption`            10--11 px Label kecil / badge

### Weight

  Token                        Weight visual Penggunaan
  -------------------------- --------------- -------------------------
  `--font-weight-regular`                400 Body
  `--font-weight-medium`                 500 Label / metadata
  `--font-weight-semibold`               600 Card title / button
  `--font-weight-bold`                   700 Page heading / emphasis

## 3. Spacing

Spacing tampak menggunakan sistem yang konsisten berbasis kelipatan
kecil. Nilai berikut adalah **perkiraan visual** untuk membangun ulang
layout:

  Token            Nilai Penggunaan
  -------------- ------- ---------------------
  `--space-1`       4 px Gap icon-text kecil
  `--space-2`       8 px Gap kecil
  `--space-3`      12 px Padding kecil / gap
  `--space-4`      16 px Padding card / form
  `--space-5`      20 px Gap antar group
  `--space-6`      24 px Padding section
  `--space-8`      32 px Gap section
  `--space-10`     40 px Jarak section besar

## 4. Border Radius

Visual UI sangat dominan menggunakan rounded corners.

  Token               Nilai visual Penggunaan
  ----------------- -------------- ------------------------------
  `--radius-sm`               6 px Input kecil / badge tertentu
  `--radius-md`              10 px Input, filter pill
  `--radius-lg`              14 px Card
  `--radius-xl`              18 px Card/form besar
  `--radius-2xl`             24 px Container besar / panel
  `--radius-full`          9999 px Pill / chip / status badge

## 5. Borders

-   Border umum terlihat tipis, sekitar **1 px**.
-   Border card/input menggunakan neutral light.
-   Selected state menggunakan teal yang lebih kuat.
-   Beberapa upload area menggunakan **dashed border**.
-   Card utama pada Home menggunakan border teal ketika
    selected/highlighted.

## 6. Shadows

Shadow pada desain bersifat **soft dan low elevation**, bukan shadow
yang berat.

  Token           Penggunaan
  --------------- ----------------------------------------------
  `--shadow-sm`   Input / control / small card
  `--shadow-md`   Card utama / panel
  `--shadow-lg`   Modal/detail panel dan floating map controls

Nilai CSS shadow exact tidak dapat dipastikan dari PDF.

## 7. Component Visual Rules

### Navbar

Home dan dua halaman form memakai navbar horizontal:

-   background putih
-   rounded container
-   subtle shadow
-   logo/text "Go Around" di kiri
-   search field
-   AI recommendation button
-   icon controls
-   CTA "Tambah Tempat"
-   CTA "Lapor Fasilitas"

Home memiliki navbar yang terasa floating di atas map.

### Search

-   rounded input
-   icon search di kiri
-   placeholder abu-abu
-   pada PDF terdapat shortcut keyboard `⌘K`
-   border sangat subtle

### Filter pill

Filter Home berbentuk pill:

-   selected: primary teal dengan text putih
-   unselected: putih dengan border/shadow tipis
-   icon berwarna mengikuti makna filter
-   `Reset Filter` menggunakan style outline

### Primary button

Karakter visual:

-   primary teal
-   text putih
-   rounded
-   icon dapat berada di kiri
-   digunakan untuk CTA seperti `Buka Rute Maps`,
    `Kirim Laporan Fasilitas`, dan `Kirim Usulan Tempat`

### Secondary button

-   background putih
-   border neutral
-   text gelap
-   digunakan untuk aksi sekunder seperti batal/kembali dan detail

### Status badge

Status berbentuk pill dengan warna semantic:

-   success → hijau
-   warning → oranye
-   danger → merah
-   info → cyan/blue

### Form card

Dua halaman form memakai card putih dengan:

-   rounded corners
-   border/shadow sangat ringan
-   section heading
-   numbered section indicator berbentuk kotak rounded berwarna teal
-   label di atas input
-   helper text berukuran kecil

### Upload area

Pada halaman Add Place:

-   border dashed
-   accent teal
-   beberapa upload card berdampingan
-   icon di bagian atas
-   CTA upload berbentuk button kecil
-   informasi format dan batas ukuran di bagian bawah

Pada halaman Report:

-   tiga area bukti foto: Foto Colokan/Meja, Screenshot Speedtest, Foto
    Menu/Struk.

### Map

Home memiliki map sebagai area visual utama:

-   OpenStreetMap-style basemap
-   polygon/area spasial berwarna transparan
-   marker titik
-   circular/radius overlay
-   floating map controls di sisi kanan
-   legend floating di kanan bawah
-   scale bar

## 8. Home Layout

Secara visual:

``` text
┌─────────────────────────────────────────────────────────────┐
│ Navbar                                                      │
├─────────────────────────────────────────────────────────────┤
│ Filter Pills                                                │
├───────────────┬─────────────────────────────────────────────┤
│ Recommendation│                                             │
│ + Place List  │                 Interactive Map              │
│               │                                             │
│               │                               Detail Panel   │
├───────────────┴─────────────────────────────────────────────┤
│ Footer                                                      │
└─────────────────────────────────────────────────────────────┘
```

Karakter utama Home adalah **map-first layout** dengan sidebar daftar
tempat dan detail panel floating.

## 9. Report Page Layout

``` text
┌─────────────────────────────────────────────────────────────┐
│ Navbar                                                      │
├─────────────────────────────────────────────────────────────┤
│ Information / verification banner                           │
├────────────────────────────┬────────────────────────────────┤
│ Form                       │ Alur Penanganan Laporan       │
│                            │ Laporan Terverifikasi         │
│ 1. Cafe                    │ Penutupan Permanen            │
│ 2. Jenis masalah           │                                │
│ 3. Detail                  │                                │
│ 4. Bukti                   │                                │
│ Anonymous + contact        │                                │
│                            │                                │
│ Actions                    │                                │
├────────────────────────────┴────────────────────────────────┤
│ Footer                                                      │
└─────────────────────────────────────────────────────────────┘
```

## 10. Add Place Page Layout

``` text
┌─────────────────────────────────────────────────────────────┐
│ Navbar                                                      │
├─────────────────────────────────────────────────────────────┤
│ Page title + description                                   │
├────────────────────────────┬────────────────────────────────┤
│ 1. Basic information       │ GIS interactive map            │
│ 2. Facilities              │ Verification flow              │
│ 3. Budget                  │ Quality standard                │
│ 4. Photos                  │                                │
│ 5. Anonymous submission    │                                │
├────────────────────────────┴────────────────────────────────┤
│ Footer                                                      │
└─────────────────────────────────────────────────────────────┘
```

## 11. Responsive Direction

Responsiveness tidak dispesifikkan secara eksplisit oleh PDF. Yang dapat
diturunkan dari layout:

-   Desktop menggunakan multi-column layout.
-   Home membutuhkan prioritas khusus karena map adalah elemen utama.
-   Sidebar dan detail panel perlu berubah menjadi stacked/drawer pada
    viewport sempit.
-   Form desktop menggunakan dua kolom; pada layar kecil dapat menjadi
    satu kolom.
-   Upload cards yang horizontal perlu dapat menjadi stacked/grid yang
    lebih sempit.

Bagian ini adalah **implementasi responsif yang perlu divalidasi
terhadap Figma**, bukan token yang terlihat langsung dari PDF.

## 12. Content / Terminology Rules

Gunakan Bahasa Indonesia untuk UI user-facing, mengikuti istilah pada
desain:

-   `Cari cafe, jalan, atau area Bogor...`
-   `Cari rekomendasi AI`
-   `Tambah Tempat`
-   `Lapor Fasilitas`
-   `Reset Filter`
-   `Skor Tertinggi`
-   `Paling Dekat`
-   `Paling Hemat`
-   `Buka Rute Maps`
-   `Detail Fasilitas`
-   `Lapor / Koreksi Data`
-   `Tambah & Rekomendasikan Tempat Nugas Baru`
-   `Kirim Laporan Fasilitas`
-   `Kirim Usulan Tempat`

## 13. Implementation Boundary

Token ini **belum mendefinisikan**:

-   endpoint API
-   state management
-   database
-   authentication
-   admin UI
-   business logic scoring
-   algoritma rekomendasi AI
-   struktur React component
-   exact Figma measurements yang tidak tersedia di PDF

Hal-hal tersebut mengikuti `api-contract.md`, project plan, dan
keputusan implementasi berikutnya.
