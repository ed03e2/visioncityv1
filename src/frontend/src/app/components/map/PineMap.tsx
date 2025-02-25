"use client";
import { useEffect, useState, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { BitmapLayer, IconLayer } from "@deck.gl/layers";
import Map from "react-map-gl";
import Modal from "../ui/modal";
import Input from "../ui/input";
import Button from "../ui/button";

const API_URLS = {
  BITMAP: "http://localhost:5000/bitmap",
};

export const DECK_GL_CONTROLLER = {
  touchZoom: true,
  keyboard: { moveSpeed: false },
  dragMode: "pan",
};

type IconData = {
  id: number;
  lat: number;
  lng: number;
  title: string;
  description: string;
};

export default function SimpleMap() {
  const [bitmapImage, setBitmapImage] = useState<string | null>(null);
  const [center, setCenter] = useState({ lat: 25.6518, lng: -100.287 });
  const [icons, setIcons] = useState<IconData[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);

  useEffect(() => {
    fetch(API_URLS.BITMAP)
      .then((res) => res.json())
      .then((json) => {
        if (json?.image) setBitmapImage(json.image);
      })
      .catch((err) => console.error("Error fetching bitmap image:", err));
  }, []);

  const addIcon = (lat: number, lng: number) => {
    const newIcon = {
      id: Date.now(),
      lat,
      lng,
      title: "",
      description: "",
    };
    setIcons((prevIcons) => [...prevIcons, newIcon]);
  };

  const updateIcon = (field: keyof IconData, value: string) => {
    if (!selectedIcon) return;
    setSelectedIcon((prev) => prev && { ...prev, [field]: value });
  };

  const saveIconChanges = () => {
    if (!selectedIcon) return;
    setIcons((prevIcons) =>
      prevIcons.map((icon) => (icon.id === selectedIcon.id ? selectedIcon : icon))
    );
    setSelectedIcon(null);
  };

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

  const markersLayer = useMemo(() => {
    return new IconLayer({
      id: "icon-layer",
      data: icons,
      pickable: true,
      iconAtlas: "https://i.imgur.com/KOSc9lf.png",
      iconMapping: { marker: { x: 0, y: 0, width: 128, height: 128, mask: true } },
      getIcon: () => "marker",
      sizeScale: 20,
      getPosition: (d) => [d.lng, d.lat],
      onClick: (info) => {
        if (info.object) {
          setSelectedIcon(info.object);
        }
      },
    });
  }, [icons]);

  return (
    <>
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

      {/* 📌 Modal para editar iconos */}
      <Modal isOpen={!!selectedIcon} onClose={() => setSelectedIcon(null)}>
        <h2 className="text-lg font-semibold mb-4 bg text-white">Editar Punto</h2>
        <Input label="Nombre" value={selectedIcon?.title || ""} onChange={(e) => updateIcon("title", e.target.value)} />
        <Input label="Url" value={selectedIcon?.description || ""} onChange={(e) => updateIcon("description", e.target.value)} />
        <br/>
        <Button text="Guardar" onClick={saveIconChanges} />
      </Modal>
    </>
  );
}
