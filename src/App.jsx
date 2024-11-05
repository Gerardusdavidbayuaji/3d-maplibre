import { useEffect, useRef, useState } from "react";

import { GeoJsonLayer } from "deck.gl";
import { TerrainLayer } from "@deck.gl/geo-layers";
import DeckGL from "@deck.gl/react";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

import { LucideMountainSnow } from "lucide-react";
import { Building } from "lucide-react";

// URL untuk gaya peta dan gambar elevasi
// NOTE TAMPILAN 3D SERMO DAN SEMPOR
// SERMO:
// texture: http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Awaduk_sermo_new1&bbox=110.0981098109811%2C-7.840722%2C110.13058805880588%2C-7.806780678067805&width=768&height=455&srs=EPSG%3A4326&styles=&format=image%2Fpng
// elevation: http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Adem_waduk_sermo&bbox=110.0981098109811%2C-7.840722%2C110.13058805880588%2C-7.806780678067805&width=734&height=768&srs=EPSG%3A4326&styles=&format=image%2Fpng

// SEMPOR:
// texture: http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Awaduk_sempor_new1&bbox=109.462891%2C-7.572007200720072%2C109.514411%2C-7.532178217821777&width=768&height=455&srs=EPSG%3A4326&styles=&format=image%2Fpng
// elevation: http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Adem_sempor&bbox=109.462891%2C-7.572007200720072%2C109.514411%2C-7.532178217821777&width=768&height=585&srs=EPSG%3A4326&styles=&format=image%2Fpng

// NOTE KOORDINAT AWAL
// SERMO:
// x: 110.1173
// y: -7.8233

// SEMPOR:
// x: 109.493804
// y: -7.552214

const MAP_STYLE_URL =
  "https://api.maptiler.com/maps/satellite/style.json?key=AW8IuG306IIk8kNdxEw6";
const TERRAIN_TEXTURE_URL =
  "http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Awaduk_sempor_new1&bbox=109.462891%2C-7.572007200720072%2C109.514411%2C-7.532178217821777&width=768&height=455&srs=EPSG%3A4326&styles=&format=image%2Fpng";
const ELEVATION_DATA_URL =
  "http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Adem_sempor&bbox=109.462891%2C-7.572007200720072%2C109.514411%2C-7.532178217821777&width=768&height=585&srs=EPSG%3A4326&styles=&format=image%2Fpng";
const BANGUNAN_SEMPOR =
  "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3Abangunan_sempor&outputFormat=application%2Fjson";

const INITIAL_VIEW_STATE = {
  longitude: 109.493804,
  latitude: -7.552214,
  zoom: 13.5,
  bearing: 0,
  pitch: 0,
  maxPitch: 80,
  minZoom: 2,
  maxZoom: 30,
};

const App = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [isTerrainActive, setIsTerrainActive] = useState(false);
  const [buildingData, setBuildingData] = useState(null);
  const [isBuildingActive, setIsBuildingActive] = useState(false);

  useEffect(() => {
    fetch(BANGUNAN_SEMPOR)
      .then((response) => response.json())
      .then((data) => setBuildingData(data))
      .catch((error) => console.error("error fatching building data", error));
  }, []);

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
    mapInstance.addControl(new maplibregl.NavigationControl(), "top-right");

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
    // bounds: [
    //   110.0981098109811, -7.840722, 110.13058805880588, -7.806780678067805,
    // ], // sermo
    bounds: [109.462891, -7.572007200720072, 109.514411, -7.532178217821777], // sempor
    elevationDecoder: {
      rScaler: 1,
      gScaler: 0,
      bScaler: 0,
      offset: 0,
    },
  });

  const buildingLayer = new GeoJsonLayer({
    id: "building-layer",
    data: buildingData,
    extruded: true,
    wireframe: false,
    getFillColor: (f) => {
      const high = f.properties.high || 0;

      if (high >= 10) return [228, 97, 97];
      else if (high >= 8) return [241, 185, 99];
      else if (high >= 6) return [255, 255, 157];
      else if (high >= 4) return [160, 228, 176];
      else if (high >= 2) return [225, 215, 198];
      else return [225, 215, 198];
    },

    getElevation: (f) => (f.properties.high ? f.properties.high * 1 : 3),
  });

  const toggleTerrain = () => {
    setIsTerrainActive((prev) => !prev);
  };

  const toggleBuilding = () => {
    setIsBuildingActive((prev) => !prev);
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      <DeckGL
        viewState={viewState}
        controller={true}
        layers={[
          isTerrainActive ? terrainLayer : null,
          isBuildingActive && buildingData ? buildingLayer : null,
        ].filter(Boolean)}
        onViewStateChange={({ viewState }) => {
          setViewState(viewState);
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

      <div className="space-y-10">
        <button
          onClick={toggleTerrain}
          className={`p-2 rounded-md shadow-lg absolute top-28 right-[9px] ${
            isTerrainActive ? "bg-[#FF7517]" : "bg-white"
          }`}
        >
          <LucideMountainSnow className="w-4 h-4" />
        </button>

        <button
          onClick={toggleBuilding}
          className={`p-2 rounded-md shadow-lg absolute top-28 right-[9px] ${
            isBuildingActive ? "bg-[#FF7517]" : "bg-white"
          }`}
        >
          <Building className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default App;
