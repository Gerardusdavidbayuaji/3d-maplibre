import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./styles/index.css";
import BuildingsSempor from "./components/BuildingsSempor.jsx";
import BuildingsSermo from "./components/buildingsSermo.jsx";
import TerrainSempor from "./components/terrainSempor.jsx";
import TerrainSermo from "./components/terrainSermo.jsx";
import TerrainModelSempor from "./components/TerrainModelSempor.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <BuildingsSempor /> */}
    {/* <BuildingsSermo /> */}
    <TerrainModelSempor />
    {/* <TerrainSermo /> */}
  </StrictMode>
);
