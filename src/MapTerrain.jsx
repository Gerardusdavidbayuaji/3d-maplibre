import { TerrainLayer } from "@deck.gl/geo-layers";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";

const mapStyle =
  "https://api.maptiler.com/maps/satellite/style.json?key=AW8IuG306IIk8kNdxEw6";
const terrainImage =
  "http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Awaduk_sermo_new1&bbox=110.0981098109811%2C-7.840722%2C110.13058805880588%2C-7.806780678067805&width=768&height=455&srs=EPSG%3A4326&styles=&format=image%2Fpng";
const elevationImage =
  "http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Adem_waduk_sermo&bbox=110.0981098109811%2C-7.840722%2C110.13058805880588%2C-7.806780678067805&width=734&height=768&srs=EPSG%3A4326&styles=&format=image%2Fpng";

const INITIAL_VIEW_STATE = {
  longitude: 110.11731582824113,
  latitude: -7.8233334967095995,
  zoom: 14,
  bearing: 0,
  pitch: 45,
  maxPitch: 60,
  minZoom: 2,
  maxZoom: 30,
  antialias: true,
};

const MapTerrain = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      bearing: INITIAL_VIEW_STATE.bearing,
      pitch: INITIAL_VIEW_STATE.pitch,
      maxPitch: INITIAL_VIEW_STATE.maxPitch,
      minZoom: INITIAL_VIEW_STATE.minZoom,
      maxZoom: INITIAL_VIEW_STATE.maxZoom,
      antialias: INITIAL_VIEW_STATE.antialias,
    });

    mapRef.current = map;

    const navControl = new maplibregl.NavigationControl({
      showZoom: true,
      showCompass: true,
    });
    map.addControl(navControl, "top-right");

    return () => map.remove();
  }, []);

  // Define Terrain Layer
  const terrainLayer = new TerrainLayer({
    id: "terrain-layer",
    minZoom: 0,
    maxZoom: 23,
    strategy: "no-overlap",
    elevationDecoder: {
      rScaler: 0.9,
      gScaler: 0.1,
      bScaler: 0.1,
      offset: 0,
    },
    elevationData: elevationImage,
    texture: terrainImage,
    bounds: [
      110.0981098109811, -7.841059105910591, 110.13058805880588,
      -7.806780678067805,
    ],
  });

  return (
    <div className="relative w-full h-screen">
      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* DeckGL overlay */}
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[terrainLayer]}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default MapTerrain;
