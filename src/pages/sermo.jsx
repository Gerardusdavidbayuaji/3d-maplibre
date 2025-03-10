import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

import { Button } from "@/components/ui/button";
import {
  LucideMountainSnow,
  AudioWaveform,
  RefreshCcwDot,
  MapPinHouse,
  Building,
  Focus,
} from "lucide-react";

const minLat = -7.859083;
const minLng = 110.080009;
const maxLat = -7.788723;
const maxLng = 110.148687;

const ModelSermo = () => {
  const [isWaterBoundariesActive, setIsWaterBoundariesActive] = useState(false);
  const [isDataLayerVisible, setIsDataLayerVisible] = useState(false);
  const [isBuildingActive, setIsBuildingActive] = useState(false);
  const [isTerrainActive, setIsTerrainActive] = useState(true);
  const [isSemporActive, setIsSemporActive] = useState(false);
  const [isRotateActive, setIsRotateActive] = useState(false);
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [isSermoActive, setIsSermoActive] = useState(true);
  const [alatSemporData, setAlatSemporData] = useState([]);
  const [isToolActive, setIsToolActive] = useState(false);

  const mapRef = React.useRef(null);
  const navigate = useNavigate();
  const rotationRequestRef = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      zoom: 14.9,
      center: [110.11322114414544, -7.822850552983699],
      pitch: 72,
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
            data: "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3APDA_PCH_SERMO_TEST&outputFormat=application%2Fjson",
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
            paint: { "line-color": "#4ca5e9", "line-width": 0.5 },
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
          const { waduk, x, y } = feature.properties;

          popup
            .setLngLat([x, y])
            .setHTML(
              `<strong> nama: ${waduk}</strong><br/>longitude: ${x}<br/>latitude: ${y}`
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

    return () => {
      map.remove();
    };
  }, [isTerrainActive]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3APDA_PCH_SERMO_TEST&outputFormat=application%2Fjson"
        );
        const data = await response.json();
        setAlatSemporData(data.features || []);
      } catch (error) {
        console.log("upss.. error fetch data:", error);
      }
    }

    fetchData();
  }, []);

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
    setIsDataLayerVisible((prev) => !prev);
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

  const handleToggleSempor = () => {
    setIsSemporActive(true);
    setIsSermoActive(false);
    navigate("/");
  };

  const handleToggleSermo = () => {
    setIsSermoActive(true);
    setIsSemporActive(false);
    navigate("/sermo");
  };

  const handleFlyTo = (no, coordinates) => {
    setIsFocusActive(no);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: coordinates,
        zoom: 18,
        // zoom: 10,
        speed: 0.3,
        pitch: 60,
        curve: 1.42,
        essential: true,
      });
    }
  };

  const toggleRotateCamera = () => {
    setIsRotateActive((prev) => !prev);
  };

  useEffect(() => {
    if (mapRef.current) {
      const rotateStep = () => {
        if (!isRotateActive) return;
        const newRotation = (mapRef.current.getBearing() + 1) % 360;
        mapRef.current.rotateTo(newRotation, { duration: 16 });
        rotationRequestRef.current = requestAnimationFrame(rotateStep);
      };

      if (isRotateActive) {
        rotationRequestRef.current = requestAnimationFrame(rotateStep);
      } else if (rotationRequestRef.current) {
        cancelAnimationFrame(rotationRequestRef.current);
      }

      return () => {
        if (rotationRequestRef.current) {
          cancelAnimationFrame(rotationRequestRef.current);
        }
      };
    }
  }, [isRotateActive]);

  return (
    <div className="relative w-full h-screen">
      <div id="map" className="w-full h-full relative" />

      <div className="flex absolute top-5 rounded-md space-x-2 right-14">
        <Button
          onClick={handleToggleSempor}
          className={`bg-white hover:bg-[#E6E6E6] text-[#333333] h-[30px] text-sm font-medium p-2 rounded shadow-none transition duration-500 ease-in-out ${
            isSemporActive ? "bg-[#FF7517] hover:bg-[#E66A15]" : "bg-white"
          }`}
        >
          Sempor
        </Button>
        <Button
          onClick={handleToggleSermo}
          className={`bg-white hover:bg-[#E6E6E6] text-[#333333] h-[30px] text-sm font-medium p-2 rounded shadow-none transition duration-500 ease-in-out ${
            isSermoActive ? "bg-[#FF7517] hover:bg-[#E66A15]" : "bg-white"
          }`}
        >
          Sermo
        </Button>
      </div>

      <div className="flex flex-col absolute top-5 right-[9px]">
        <Button
          onClick={handleToggleTerrain}
          className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#333333] h-[29px] rounded-b-none rounded-t-md shadow-none ${
            isTerrainActive ? "bg-[#FF7517] hover:bg-[#E66A15]" : "bg-white"
          }`}
        >
          <LucideMountainSnow />
        </Button>
        <Button
          onClick={handleToggleTool}
          className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#333333] h-[29px] rounded-none shadow-none ${
            isToolActive ? "bg-[#FF7517] hover:bg-[#E66A15]" : "bg-white"
          }`}
        >
          <MapPinHouse />
        </Button>
        <Button
          onClick={handleToggleWaterBoundaries}
          className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#333333] h-[29px] rounded-none shadow-none ${
            isWaterBoundariesActive
              ? "bg-[#FF7517] hover:bg-[#E66A15]"
              : "bg-white"
          }`}
        >
          <AudioWaveform />
        </Button>
        <Button
          onClick={handleToggleBuildings}
          className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#333333] h-[29px] rounded-t-none rounded-b-md shadow-none ${
            isBuildingActive ? "bg-[#FF7517] hover:bg-[#E66A15]" : "bg-white"
          }`}
        >
          <Building />
        </Button>
      </div>

      <div
        className={`bg-white top-5 left-[9px] absolute w-60 h-1/2 rounded-md transition-transform duration-500 ease-in-out ${
          isDataLayerVisible
            ? "translate-x-0"
            : "-translate-x-[calc(100%+1rem)]"
        }`}
      >
        <div className="flex bg-[#333333] text-[#FF7517] justify-center text-center p-3 rounded-t-md">
          <h3>Fly to Data</h3>
        </div>
        <div className="p-3 text-[#333333] space-y-3 overflow-y-auto h-72">
          {alatSemporData.map((item) => (
            <div
              key={item.properties.no}
              className="flex justify-between items-center border border-[#333333] rounded-md p-2"
            >
              <p className="text-sm truncate ... w-32">
                {item.properties.waduk}
              </p>
              <div className="space-x-2">
                <Button
                  key={item.properties.no}
                  onClick={() =>
                    handleFlyTo(item.properties.no, [
                      item.properties.x,
                      item.properties.y,
                    ])
                  }
                  className={`bg-transparent hover:bg-transparent text-[#333333] hover:text-[#FF7517] w-4 h-6 shadow-none ${
                    isFocusActive === item.properties.no
                      ? "text-[#FF7517]"
                      : "bg-transparent hover:bg-transparent"
                  }`}
                >
                  <Focus />
                </Button>
                <Button
                  onClick={toggleRotateCamera}
                  className={`bg-transparent hover:bg-transparent w-4 h-6 shadow-none ${
                    isRotateActive === item.properties.no
                      ? "text-[#FF7517]"
                      : "text-[#333333] hover:text-[#FF7517]"
                  }`}
                >
                  <RefreshCcwDot />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelSermo;
