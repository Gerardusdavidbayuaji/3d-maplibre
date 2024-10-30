import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const mapStyle =
  "https://api.maptiler.com/maps/satellite/style.json?key=AW8IuG306IIk8kNdxEw6";
const terrainData =
  "http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Adem_waduk_sermo&bbox=110.0981098109811%2C-7.841059105910591%2C110.13058805880588%2C-7.806780678067805&width=727&height=768&srs=EPSG%3A4326&styles=&format=image%2Fpng";

// Atur view state awal
const INITIAL_VIEW_STATE = {
  longitude: 110.11731582824113, // sermo
  latitude: -7.8233334967095995,
  zoom: 14,
  bearing: 0,
  // pitch: 45,
  pitch: 0,
  maxPitch: 60,
  minZoom: 2,
  maxZoom: 30,
  antialias: true,
};

const MapTerrain = () => {
  const mapContainerRef = useRef(null);

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

    const navControl = new maplibregl.NavigationControl({
      showZoom: true,
      showCompass: true,
    });
    map.addControl(navControl, "top-right");

    // Tambahkan sumber data WMS
    map.on("load", () => {
      // Tambahkan sumber data WMS dengan URL yang sesuai
      map.addSource("terrain-data", {
        // type: "raster",
        // tiles: [terrainData],
        // tileSize: 256,
        type: "image",
        url: terrainData,
        coordinates: [
          [110.0981098109811, -7.806780678067805], // Koordinat sudut kiri bawah
          [110.13058805880588, -7.806780678067805], // Koordinat sudut kanan bawah
          [110.13058805880588, -7.841059105910591], // Koordinat sudut kanan atas
          [110.0981098109811, -7.841059105910591], // Koordinat sudut kiri atas
        ],
      });

      // Tambahkan layer untuk menampilkan data WMS
      map.addLayer({
        id: "terrain-layer",
        type: "raster",
        source: "terrain-data",
        minzoom: 0,
        maxzoom: 22,
      });

      // Hanya menampilkan satu data dengan mengatur visibility
      map.setLayoutProperty("terrain-layer", "visibility", "visible");
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} className="relative w-full h-screen" />;
};

export default MapTerrain;
