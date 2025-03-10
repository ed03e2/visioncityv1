"use client";
import { useEffect, useState, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { BitmapLayer, IconLayer } from "@deck.gl/layers";
import Map from "react-map-gl";
import { INFO_CAMERAS } from "@/app/constanst";

const API_URLS = {
  BITMAP: "http://localhost:5000/bitmap",
};

export const DECK_GL_CONTROLLER = {
  touchZoom: true,
  keyboard: { moveSpeed: false },
  dragMode: "pan",
};

export default function SimpleMap() {
  const [bitmapImage, setBitmapImage] = useState<string | null>(null);
  const [center] = useState({ lat: 25.6518, lng: -100.287 });

  // ✅ Fetch Bitmap Image (Static Data)
  useEffect(() => {
    fetch(API_URLS.BITMAP)
      .then((res) => res.json())
      .then((json) => {
        if (json?.image) setBitmapImage(json.image);
      })
      .catch((err) => console.error("Error fetching bitmap image:", err));
  }, []);

  // ✅ Capa de Iconos (Cámaras)
  const iconLayer = new IconLayer({
    id: "cameras-layer",
    data: INFO_CAMERAS,
    pickable: true,
    iconAtlas: "https://cdn-icons-png.flaticon.com/512/4017/4017956.png",
    iconMapping: {
      camera: { x: 0, y: 0, width: 512, height: 512, mask: true },
    },
    getIcon: () => "camera",
    sizeScale: 15, // Ajustamos el tamaño
    getSize: () => 50, // Tamaño en píxeles del ícono
    getPosition: (d) => d.position, // [longitud, latitud]
  });

  // ✅ Renderizar las capas en Deck.GL
  const renderLayers = useMemo(() => {
    return [
      bitmapImage &&
        new BitmapLayer({
          id: "bitmap-layer",
          bounds: [
            [-100.28813684548274, 25.650376387020653],
            [-100.28813684548274, 25.654316647171434],
            [-100.28389981756604, 25.654316647171434],
            [-100.28389981756604, 25.650376387020653],
          ],
          image: bitmapImage,
          opacity: 1,
        }),
      iconLayer, // ✅ Agregamos la capa de iconos
    ].filter(Boolean);
  }, [bitmapImage]);

  return (
    <DeckGL
      controller={DECK_GL_CONTROLLER}
      initialViewState={{
        latitude: center.lat,
        longitude: center.lng,
        zoom: 15,
      }}
      layers={renderLayers}
      getTooltip={({ object }) =>
        object ? `📷 Cámara en ${object.position}` : null
      }
    >
      <Map
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken="pk.eyJ1IjoibGFtZW91Y2hpIiwiYSI6ImNsa3ZqdHZtMDBjbTQzcXBpNzRyc2ljNGsifQ.287002jl7xT9SBub-dbBbQ"
      />
    </DeckGL>
  );
}
