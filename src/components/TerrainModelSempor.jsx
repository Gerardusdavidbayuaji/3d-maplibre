import React, { useEffect } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

const TerrainModelSempor = () => {
  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      zoom: 14,
      center: [109.48655, -7.55516],
      pitch: 70,
      hash: true,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://api.maptiler.com/maps/satellite/{z}/{x}/{y}@2x.jpg?key=AW8IuG306IIk8kNdxEw6",
            ],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors",
            maxzoom: 19,
          },
          terrainSource: {
            type: "raster-dem",
            url: "https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=AW8IuG306IIk8kNdxEw6",
            tileSize: 256,
          },
          alatSempor: {
            type: "geojson",
            data: "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3Ademos_alat_sempor&outputFormat=application%2Fjson",
          },
          batasWadukSempor: {
            type: "geojson",
            data: "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3Abatas_waduk_sempor&outputFormat=application%2Fjson",
          },
          bangunanSempor: {
            type: "geojson",
            data: "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3Abangunan_sempor2&outputFormat=application%2Fjson",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
          {
            id: "wadukSemporLine",
            type: "line",
            source: "batasWadukSempor",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#FF0000", "line-width": 0.5 },
          },
          {
            id: "alat-sempor-layer",
            type: "symbol",
            source: "alatSempor",
            layout: {
              "icon-image": "workshop-icon",
              "icon-size": 0.3,
            },
          },
        ],
        terrain: { source: "terrainSource", exaggeration: 1 },
        sky: {},
      },
      maxZoom: 18,
      maxPitch: 85,
    });

    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true,
      })
    );

    map.addControl(
      new maplibregl.TerrainControl({
        source: "terrainSource",
        exaggeration: 1,
      }),
      "top-right"
    );

    const loadImage = () => {
      const img = new Image();
      img.src = "/icon_workshop.png";
      img.onload = () => {
        map.addImage("workshop-icon", img);
      };
    };

    map.on("load", () => {
      loadImage();

      // Add the 3D building layer using the 'high' property
      map.addLayer({
        id: "3d-buildings",
        type: "fill-extrusion",
        source: "bangunanSempor", // Use the bangunanSempor GeoJSON source
        paint: {
          "fill-extrusion-color": [
            "interpolate",
            ["linear"],
            ["*", ["get", "high"], 2], // Use the 'high' property for height
            0,
            "gray", // Jika ketinggian 0, warna gray
            2,
            "lightgray", // Untuk ketinggian 10, warna lightgray
            4,
            "yellow", // Untuk ketinggian 20, warna yellow
            6,
            "orange", // Untuk ketinggian 30, warna orange
            8,
            "red", // Untuk ketinggian 50, warna merah
            10,
            "purple", // Untuk ketinggian 100, warna purple
          ],
          "fill-extrusion-height": ["*", ["get", "high"], 2], // Set height using 'high' property
          "fill-extrusion-base": 0,
        },
      });

      let popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on("click", "alat-sempor-layer", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["alat-sempor-layer"],
        });

        if (features.length > 0) {
          const feature = features[0];
          const { nama, x, y } = feature.properties;

          popup
            .setLngLat([x, y])
            .setHTML(
              `<strong> nama: ${nama}</strong><br/>longitude: ${x}<br/>latitude: ${y}`
            )
            .addTo(map);
        }
      });

      map.on("mouseenter", "alat-sempor-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "alat-sempor-layer", () => {
        popup.remove();
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div id="map" className="w-full h-full" />
    </div>
  );
};

export default TerrainModelSempor;
