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
