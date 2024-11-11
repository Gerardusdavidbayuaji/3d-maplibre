import { useState } from "react";
import { TerrainLayer } from "deck.gl";
import DeckGL from "@deck.gl/react";

const TERRAIN_TEXTURE_URL =
  "http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Awaduk_sermo_new1&bbox=110.0981098109811%2C-7.840722%2C110.13058805880588%2C-7.806780678067805&width=768&height=455&srs=EPSG%3A4326&styles=&format=image%2Fpng";
const ELEVATION_DATA_URL =
  "http://localhost:8080/geoserver/geovault/wms?service=WMS&version=1.1.0&request=GetMap&layers=geovault%3Adem_waduk_sermo&bbox=110.0981098109811%2C-7.840722%2C110.13058805880588%2C-7.806780678067805&width=734&height=768&srs=EPSG%3A4326&styles=&format=image%2Fpng";
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

const TerrainSermo = () => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const terrainLayer = new TerrainLayer({
    id: "terrain-layer",
    elevationData: ELEVATION_DATA_URL,
    texture: TERRAIN_TEXTURE_URL,
    bounds: [109.462891, -7.572007200720072, 109.514411, -7.532178217821777],
    elevationDecoder: {
      rScaler: 1.3,
      gScaler: 0,
      bScaler: 0,
      offset: 0,
    },
  });

  return (
    <div className="relative w-full h-screen">
      <DeckGL
        viewState={viewState}
        controller={true}
        layers={[terrainLayer]}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        style={{ position: "absolute", inset: 0 }}
      />
    </div>
  );
};

export default TerrainSermo;
