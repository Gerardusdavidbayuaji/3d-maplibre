import { useEffect, useRef, useState } from "react";
import { TerrainLayer } from "@deck.gl/geo-layers";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import { Image } from "lucide-react";

// URL untuk gaya peta dan gambar elevasi
const MAP_STYLE_URL =
  "https://api.maptiler.com/maps/satellite/style.json?key=AW8IuG306IIk8kNdxEw6";
const TERRAIN_TEXTURE_URL =
  "http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Awaduk_sermo_new1&bbox=110.0981098109811%2C-7.840722%2C110.13058805880588%2C-7.806780678067805&width=768&height=455&srs=EPSG%3A4326&styles=&format=image%2Fpng";
const ELEVATION_DATA_URL =
  "http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Adem_waduk_sermo&bbox=110.0981098109811%2C-7.840722%2C110.13058805880588%2C-7.806780678067805&width=734&height=768&srs=EPSG%3A4326&styles=&format=image%2Fpng";

// State tampilan awal untuk MapLibre dan DeckGL
const INITIAL_VIEW_STATE = {
  longitude: 110.1173,
  latitude: -7.8233,
  zoom: 13.5,
  bearing: 0,
  pitch: 0, // Awalnya tanpa efek pitch
  maxPitch: 80,
  minZoom: 2,
  maxZoom: 30,
};

const App = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [isTerrainActive, setIsTerrainActive] = useState(false); // State efek terrain

  // Inisialisasi MapLibre dan sinkronisasi dengan DeckGL pada saat halaman dimuat
  useEffect(() => {
    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE_URL,
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      bearing: viewState.bearing,
      pitch: viewState.pitch,
      maxPitch: viewState.maxPitch,
      minZoom: viewState.minZoom,
      maxZoom: viewState.maxZoom,
      antialias: true,
    });

    mapInstanceRef.current = mapInstance;

    // Tambahkan kontrol navigasi
    mapInstance.addControl(new maplibregl.NavigationControl(), "top-right");

    // Sinkronisasi state tampilan antara MapLibre dan DeckGL
    mapInstance.on("move", () => {
      const { lng, lat } = mapInstance.getCenter();
      setViewState((prevViewState) => ({
        ...prevViewState,
        longitude: lng,
        latitude: lat,
        zoom: mapInstance.getZoom(),
        bearing: mapInstance.getBearing(),
        pitch: mapInstance.getPitch(),
      }));
    });

    return () => mapInstance.remove();
  }, []);

  // Definisikan Terrain Layer untuk DeckGL
  const terrainLayer = new TerrainLayer({
    id: "terrain-layer",
    elevationData: ELEVATION_DATA_URL,
    texture: TERRAIN_TEXTURE_URL,
    bounds: [110.0981, -7.8411, 110.1306, -7.8068],
    elevationDecoder: {
      rScaler: 1,
      gScaler: 0,
      bScaler: 0,
      offset: 0,
    },
  });

  // Fungsi toggle efek terrain
  const toggleTerrain = () => {
    setIsTerrainActive((prev) => !prev);
    setViewState((prevViewState) => ({
      ...prevViewState,
      pitch: isTerrainActive ? 0 : 45, // Set pitch untuk efek 3D
    }));
  };

  return (
    <div className="relative w-full h-screen">
      {/* Kontainer MapLibre */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Overlay DeckGL */}
      <DeckGL
        viewState={viewState} // Sinkronisasi viewState untuk pergerakan yang lancar
        controller={true}
        layers={isTerrainActive ? [terrainLayer] : []} // Tampilkan terrainLayer jika aktif
        onViewStateChange={({ viewState }) => {
          setViewState(viewState);
          // Sinkronisasi tampilan MapLibre dengan tampilan DeckGL
          if (mapInstanceRef.current) {
            mapInstanceRef.current.jumpTo({
              center: [viewState.longitude, viewState.latitude],
              zoom: viewState.zoom,
              bearing: viewState.bearing,
              pitch: viewState.pitch,
            });
          }
        }}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* Tombol toggle terrain */}
      <button
        onClick={toggleTerrain}
        className="bg-white p-2 rounded-md shadow-lg absolute top-28 right-[9px]"
      >
        <Image className="w-4 h-4" />
      </button>
    </div>
  );
};

export default App;
