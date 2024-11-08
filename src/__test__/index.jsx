// sources: {
//     // Define terrain DEM source only for the terrain configuration
//     terrainSource: {
//       type: "raster-dem",
//       tiles: [
//         "http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Adem_sempor&bbox=109.462891%2C-7.572007200720072%2C109.514411%2C-7.532178217821777&width=768&height=585&srs=EPSG%3A4326&styles=&format=image%2Fpng",
//       ],
//       tileSize: 256,
//     },
//     // Define hillshade source as raster
//     hillshadeSource: {
//       type: "raster-dem",
//       tiles: [
//         "http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Ahillshade_sempor&bbox=109.46264626462646%2C-7.572007200720072%2C109.51492649264927%2C-7.532178217821777&width=768&height=585&srs=EPSG%3A4326&styles=&format=image%2Fpng",
//       ],
//       tileSize: 256,
//     },
//     // Define reservoir boundary source as GeoJSON
//     batasWadukSource: {
//       type: "geojson",
//       data: "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3Abatas_waduk_sempor&outputFormat=application%2Fjson",
//     },
//   },

// import React, { useEffect, useRef, useState } from "react";
// import "maplibre-gl/dist/maplibre-gl.css";
// import maplibregl from "maplibre-gl";

// import {
//   MapPin,
//   AudioWaveformIcon,
//   BuildingIcon,
//   MountainSnowIcon,
// } from "lucide-react";

// const TerrainModelSempor = () => {
//   const mapContainer = useRef(null);
//   const [map, setMap] = useState(null);
//   const [layerStates, setLayerStates] = useState({
//     terrain: false,
//     buildings: false,
//     waduk: false,
//     alat: false,
//   });

//   useEffect(() => {
//     const initializedMap = new maplibregl.Map({
//       container: mapContainer.current,
//       zoom: 14,
//       center: [109.493804, -7.552214],
//       pitch: 70,
//       hash: true,
//       style: {
//         version: 8,
//         sources: {
//           osm: {
//             type: "raster",
//             tiles: [
//               "https://api.maptiler.com/maps/satellite/{z}/{x}/{y}@2x.jpg?key=AW8IuG306IIk8kNdxEw6",
//             ],
//             tileSize: 256,
//             attribution: "&copy; OpenStreetMap Contributors",
//             maxzoom: 19,
//           },
//           terrainSource: {
//             type: "raster-dem",
//             url: "https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=AW8IuG306IIk8kNdxEw6",
//             tileSize: 256,
//           },
//           hillshadeSource: {
//             type: "raster-dem",
//             url: "https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=AW8IuG306IIk8kNdxEw6",
//             tileSize: 256,
//           },
//           wadukSempor: {
//             type: "geojson",
//             data: "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3Abatas_waduk_sempor&outputFormat=application%2Fjson",
//           },
//           bangunanSempor: {
//             type: "geojson",
//             data: "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3Abangunan_sempor2&outputFormat=application%2Fjson",
//           },
//           demosAlatSempor: {
//             type: "geojson",
//             data: "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3Ademos_alat_sempor&outputFormat=application%2Fjson",
//           },
//         },
//         layers: [
//           {
//             id: "osm",
//             type: "raster",
//             source: "osm",
//           },
//           {
//             id: "hills",
//             type: "hillshade",
//             source: "hillshadeSource",
//             layout: { visibility: "visible" },
//             paint: { "hillshade-shadow-color": "#473B24" },
//           },
//           {
//             id: "wadukSemporLine",
//             type: "line",
//             source: "wadukSempor",
//             layout: { "line-join": "round", "line-cap": "round" },
//             paint: { "line-color": "#FF0000", "line-width": 1 },
//           },
//           {
//             id: "bangunan3D",
//             type: "fill-extrusion",
//             source: "bangunanSempor",
//             paint: {
//               "fill-extrusion-color": "#ff4d4d",
//               "fill-extrusion-height": ["*", ["get", "high"], 4],
//               "fill-extrusion-base": 0,
//               "fill-extrusion-opacity": 1,
//             },
//           },
//           {
//             id: "demosAlatSempor",
//             type: "circle",
//             source: "demosAlatSempor",
//             paint: {
//               "circle-color": "#007cbf",
//               "circle-radius": 5,
//               "circle-stroke-width": 3,
//               "circle-stroke-color": "#fff",
//             },
//           },
//         ],
//         terrain: { source: "terrainSource", exaggeration: 1 },
//         sky: {},
//       },
//       maxZoom: 18,
//       maxPitch: 85,
//     });

//     initializedMap.addControl(
//       new maplibregl.NavigationControl({
//         visualizePitch: true,
//         showZoom: true,
//         showCompass: true,
//       })
//     );
//     initializedMap.addControl(
//       new maplibregl.TerrainControl({
//         source: "terrainSource",
//         exaggeration: 1,
//       })
//     );

//     setMap(initializedMap);

//     return () => initializedMap.remove();
//   }, []);

//   const toggleLayer = (layerId) => {
//     if (map) {
//       const newState = !layerStates[layerId];
//       setLayerStates({ ...layerStates, [layerId]: newState });
//       map.setLayoutProperty(
//         layerId,
//         "visibility",
//         newState ? "visible" : "none"
//       );
//     }
//   };

//   return (
//     <div className="relative w-full h-screen">
//       <div ref={mapContainer} className="w-full h-full" />
//       <div className="absolute top-36 right-[9px] space-y-2">
//         <button
//           onClick={() => toggleLayer("terrainSource")}
//           className={`flex items-center justify-center p-2 rounded-md ${
//             layerStates.terrain ? "bg-orange-500" : "bg-white"
//           }`}
//         >
//           <MountainSnowIcon className="h-4 w-4 text-gray-800" />
//         </button>
//         <button
//           onClick={() => toggleLayer("bangunan3D")}
//           className={`flex items-center justify-center p-2 rounded-md ${
//             layerStates.buildings ? "bg-orange-500" : "bg-white"
//           }`}
//         >
//           <BuildingIcon className="h-4 w-4 text-gray-800" />
//         </button>
//         <button
//           onClick={() => toggleLayer("wadukSemporLine")}
//           className={`flex items-center justify-center p-2 rounded-md ${
//             layerStates.waduk ? "bg-orange-500" : "bg-white"
//           }`}
//         >
//           <AudioWaveformIcon className="h-4 w-4 text-gray-800" />
//         </button>
//         <button
//           onClick={() => toggleLayer("demosAlatSempor")}
//           className={`flex items-center justify-center p-2 rounded-md ${
//             layerStates.alat ? "bg-orange-500" : "bg-white"
//           }`}
//         >
//           <MapPin className="h-4 w-4 text-gray-800" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TerrainModelSempor;
