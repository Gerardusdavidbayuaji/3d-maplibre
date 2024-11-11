import React, { useEffect, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

import { Button } from "@/components/ui/button";
import {
  LucideMountainSnow,
  AudioWaveform,
  MapPinHouse,
  Building,
} from "lucide-react";

const minLat = -7.859083;
const minLng = 110.080009;
const maxLat = -7.788723;
const maxLng = 110.148687;

const ModelSermo = () => {
  const [isWaterBoundariesActive, setIsWaterBoundariesActive] = useState(false);
  const [isBuildingActive, setIsBuildingActive] = useState(false);
  const [isTerrainActive, setIsTerrainActive] = useState(true);
  const [isToolActive, setIsToolActive] = useState(false);
  const mapRef = React.useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      zoom: 15,
      center: [110.11322114414544, -7.822850552983699],
      pitch: 65,
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
          alatSermo: {
            type: "geojson",
            data: "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3Acctv_sermo&outputFormat=application%2Fjson",
          },
          batasWadukSermo: {
            type: "geojson",
            data: "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3Abatas_waduk_sermo&outputFormat=application%2Fjson",
          },
          bangunanSermo: {
            type: "geojson",
            data: "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3Abangunan_sermo&outputFormat=application%2Fjson",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
          {
            id: "batas-badan-air-sermo",
            type: "line",
            source: "batasWadukSermo",
            layout: {
              "line-join": "round",
              "line-cap": "round",
              visibility: "none",
            },
            paint: { "line-color": "#4ca5e9", "line-width": 0.7 },
          },
          {
            id: "alat-sermo-layer",
            type: "symbol",
            source: "alatSermo",
            layout: {
              "icon-image": "workshop-icon",
              "icon-size": 0.3,
              visibility: "none",
            },
          },
          {
            id: "bangunan-3d",
            type: "fill-extrusion",
            source: "bangunanSermo",
            layout: { visibility: "none" },
            paint: {
              "fill-extrusion-color": [
                "case",
                ["==", ["to-number", ["get", "high"]], 2],
                "#f7eaa8",
                ["==", ["to-number", ["get", "high"]], 4],
                "#d4dfa1",
                ["==", ["to-number", ["get", "high"]], 6],
                "#b1d59b",
                ["==", ["to-number", ["get", "high"]], 8],
                "#8eca94",
                ["==", ["to-number", ["get", "high"]], 10],
                "#6bbf8e",
                ["==", ["to-number", ["get", "high"]], 12],
                "#48b587",
                "#d6eadf",
              ],
              "fill-extrusion-height": ["to-number", ["get", "high"]],
              "fill-extrusion-base": 0,
            },
          },
        ],
        terrain: isTerrainActive
          ? { source: "terrainSource", exaggeration: 1 }
          : undefined,
        sky: isTerrainActive ? {} : undefined,
      },
      maxZoom: 18,
      maxPitch: 85,
      maxBounds: [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
    });

    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true,
      }),
      "bottom-right"
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

      let popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on("click", "alat-sermo-layer", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["alat-sermo-layer"],
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

      map.on("mouseenter", "alat-sermo-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "alat-sermo-layer", () => {
        popup.remove();
      });
    });

    mapRef.current = map;
    return () => map.remove();
  }, [isTerrainActive]);

  const toggleLayerVisibility = (layerId, isActive) => {
    if (mapRef.current) {
      mapRef.current.setLayoutProperty(
        layerId,
        "visibility",
        isActive ? "visible" : "none"
      );
    }
  };

  const handleToggleTerrain = () => {
    setIsTerrainActive((prev) => !prev);
  };

  const handleToggleTool = () => {
    setIsToolActive((prev) => !prev);
    toggleLayerVisibility("alat-sermo-layer", !isToolActive);
  };

  const handleToggleWaterBoundaries = () => {
    setIsWaterBoundariesActive((prev) => !prev);
    toggleLayerVisibility("batas-badan-air-sermo", !isWaterBoundariesActive);
  };

  const handleToggleBuildings = () => {
    setIsBuildingActive((prev) => !prev);
    toggleLayerVisibility("bangunan-3d", !isBuildingActive);
  };

  return (
    <div className="relative w-full h-screen">
      <div id="map" className="w-full h-full" />
      <div className="flex flex-col absolute top-5 right-[9px]">
        <Button
          onClick={handleToggleTerrain}
          className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#333333] h-[29px] rounded-b-none rounded-t-md ${
            isTerrainActive ? "bg-[#FF7517] hover:bg-[#E66A15]" : "bg-white"
          }`}
        >
          <LucideMountainSnow />
        </Button>
        <Button
          onClick={handleToggleTool}
          className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#333333] h-[29px] rounded-none ${
            isToolActive ? "bg-[#FF7517] hover:bg-[#E66A15]" : "bg-white"
          }`}
        >
          <MapPinHouse />
        </Button>
        <Button
          onClick={handleToggleWaterBoundaries}
          className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#333333] h-[29px] rounded-none ${
            isWaterBoundariesActive
              ? "bg-[#FF7517] hover:bg-[#E66A15]"
              : "bg-white"
          }`}
        >
          <AudioWaveform />
        </Button>
        <Button
          onClick={handleToggleBuildings}
          className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#333333] h-[29px] rounded-t-none rounded-b-md ${
            isBuildingActive ? "bg-[#FF7517] hover:bg-[#E66A15]" : "bg-white"
          }`}
        >
          <Building />
        </Button>
      </div>
    </div>
  );
};

export default ModelSermo;
