"use client";
import { useEffect, useState, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { BitmapLayer, IconLayer } from "@deck.gl/layers";
import Map from "react-map-gl";

const API_URLS = {
  BITMAP: "http://localhost:5000/bitmap",
};

export const DECK_GL_CONTROLLER = {
  touchZoom: true,
  keyboard: { moveSpeed: false },
  dragMode: "pan",
};

// Tipo para los marcadores
type IconData = {
  id: number;
  lat: number;
  lng: number;
};

export default function SimpleMap() {
  const [bitmapImage, setBitmapImage] = useState<string | null>(null);
  const [center, setCenter] = useState({ lat: 25.6518, lng: -100.287 });
  const [icons, setIcons] = useState<IconData[]>([]); // Estado para los marcadores

  // Cargar el bitmap desde la API
  useEffect(() => {
    fetch(API_URLS.BITMAP)
      .then((res) => res.json())
      .then((json) => {
        if (json?.image) setBitmapImage(json.image);
      })
      .catch((err) => console.error("Error fetching bitmap image:", err));
  }, []);

  // Función para agregar un marcador cuando el usuario hace click
  const addIcon = (lat: number, lng: number) => {
    const newIcon = { id: Date.now(), lat, lng };
    setIcons((prevIcons) => [...prevIcons, newIcon]);
  };

  // Capa del bitmap
  const bitmapLayer = useMemo(() => {
    return (
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
      })
    );
  }, [bitmapImage]);

  // Capa de marcadores
  const markersLayer = useMemo(() => {
    return new IconLayer({
      id: "icon-layer",
      data: icons,
      pickable: true,
      iconAtlas: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
      iconMapping: {
        marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
      },
      getIcon: () => "marker",
      sizeScale: 25,
      getPosition: (d) => [d.lng, d.lat],
    });
  }, [icons]);

  return (
    <DeckGL
      controller={DECK_GL_CONTROLLER}
      initialViewState={{
        latitude: center.lat,
        longitude: center.lng,
        zoom: 15,
      }}
      layers={[bitmapLayer, markersLayer]}
      onClick={(event) => {
        if (event.coordinate) {
          addIcon(event.coordinate[1], event.coordinate[0]);
        }
      }}
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
