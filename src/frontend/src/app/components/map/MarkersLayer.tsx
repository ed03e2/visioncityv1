"use client";
import { useState, useMemo } from "react";
import { IconLayer } from "@deck.gl/layers";
import Modal from "../ui/modal";

type IconData = {
  id: number;
  lat: number;
  lng: number;
  title: string;
  description: string;
};

export default function MarkersLayer({ icons, setIcons }: { icons: IconData[], setIcons: React.Dispatch<React.SetStateAction<IconData[]>> }) {
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const handleIconClick = (icon: IconData) => {
    setSelectedIcon(icon);
    setFormData({ title: icon.title, description: icon.description });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveChanges = () => {
    setIcons((prevIcons) =>
      prevIcons.map((icon) =>
        icon.id === selectedIcon?.id ? { ...icon, ...formData } : icon
      )
    );
    setSelectedIcon(null);
  };

  const renderLayer = useMemo(() => {
    return new IconLayer({
      id: "icon-layer",
      data: icons,
      pickable: true,
      iconAtlas: "/marker.png",
      iconMapping: {
        marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
      },
      getIcon: () => "marker",
      getPosition: (d) => [d.lng, d.lat],
      getSize: () => 50,
      onClick: (info) => {
        if (info.object) handleIconClick(info.object);
      },
    });
  }, [icons]);

  return (
    <>
  </>
  );
}
