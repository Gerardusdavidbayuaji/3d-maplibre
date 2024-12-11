# 3D Terrain Model

Repository ini berisi kode untuk visualisasi model medan 3D (3D terrain model).

---

## Tech Stack

- **Client:** React.js, TailwindCSS, Geoserver, MapLibre GL JS, Deck GL.

---

## MapLibre GL JS vs Mapbox GL JS

**MapLibre GL JS** dan **Mapbox GL JS** adalah pustaka yang digunakan untuk menampilkan peta interaktif, data geospasial, dan fitur visualisasi interaktif. Berikut adalah perbandingan keduanya:

### MapLibre GL JS

- **Open-source:** Dikembangkan setelah Mapbox mengubah lisensinya menjadi proprietary (Mapbox Terms of Service).
- **Rendering WebGL:** Mendukung grafik 2D dan 3D di browser.
- **Dukungan GeoJSON:** Menampilkan layer dinamis berbasis GeoJSON.
- **Kompatibilitas Tiles:** Mendukung vector tiles dan raster tiles (contoh: Geoserver).

### Mapbox GL JS

- **Proprietary:** Membutuhkan langganan untuk fitur tertentu.
- **Ekosistem Mapbox:**
  1. **Mapbox Studio:** Untuk desain visual dan manajemen data peta.
  2. **Mapbox Directions API:** Untuk perhitungan rute antar lokasi.
  3. **Mapbox Navigation API:** Untuk navigasi real-time dengan panduan turn-by-turn.
- **Rendering WebGL:** Mendukung grafik 2D dan 3D di browser.

---

## MapTiler

**MapTiler** adalah platform untuk membuat, meng-host, dan menyajikan peta berbasis tile (raster atau vektor) dengan fokus pada performa tinggi dan fleksibilitas.

### Note:

- **250.000 tile map loads** per bulan.
- **100 request per detik** maksimum.

---

# Installation

Go to the project directory

```bash
cd 3d-maplibre
```

Install dependencies

```bash
npm install
```

Start the server

```bash
npm run dev
```
