import { useState } from "react";
import { TerrainLayer, GeoJsonLayer } from "deck.gl";
import DeckGL from "@deck.gl/react";
import { COORDINATE_SYSTEM } from "@deck.gl/core";

//"http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Ahillshade_sempor&bbox=109.462891%2C-7.532510%2C109.514411%2C-7.571486&width=768&height=585&srs=EPSG%3A4326&styles=&format=image%2Fpng"
const TERRAIN_TEXTURE_URL =
  "http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Awaduk_sempor_new1&bbox=109.462891%2C-7.572007200720072%2C109.514411%2C-7.532178217821777&width=768&height=455&srs=EPSG%3A4326&styles=&format=image%2Fpng";
const ELEVATION_DATA_URL =
  "http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Adem_sempor&bbox=109.462891%2C-7.572007200720072%2C109.514411%2C-7.532178217821777&width=768&height=585&srs=EPSG%3A4326&styles=&format=image%2Fpng";

const GEOJSON_URL =
  "http://localhost:8080/geoserver/geovault/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geovault%3Abatas_waduk_sempor&outputFormat=application%2Fjson";

const INITIAL_VIEW_STATE = {
  longitude: 109.493804,
  latitude: -7.552214,
  zoom: 13.5,
  bearing: 0,
  pitch: 45, // Sudut pandang 3D
  maxPitch: 80,
  minZoom: 2,
  maxZoom: 30,
};

const TerrainSempor = () => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const terrainLayer = new TerrainLayer({
    id: "terrain-layer",
    elevationData: ELEVATION_DATA_URL,
    texture: TERRAIN_TEXTURE_URL,
    bounds: [109.462891, -7.572007200720072, 109.514411, -7.532178217821777],
    elevationDecoder: {
      rScaler: 1.3, // Elevasi 3D
      gScaler: 0,
      bScaler: 0,
      offset: 0,
    },
  });

  const batasWadukLayer = new GeoJsonLayer({
    id: "batas-waduk-layer",
    data: GEOJSON_URL,
    stroked: true,
    filled: false,
    lineWidthMinPixels: 1,
    getLineColor: [255, 0, 0], // Warna garis merah
    getLineWidth: 1,
    coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    extruded: true,
    getElevation: (d) => 10 + (d.properties.elevation || 10), // Tambahkan elevasi dinamis
    elevationScale: 1.5, // Tambahkan offset untuk membuatnya muncul di atas terrain
  });

  console.log(batasWadukLayer);

  return (
    <div className="relative w-full h-screen">
      <DeckGL
        viewState={viewState}
        controller={true}
        layers={[terrainLayer, batasWadukLayer]}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        style={{ position: "absolute", inset: 0 }}
      />
    </div>
  );
};

export default TerrainSempor;
