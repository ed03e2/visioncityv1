import React from 'react';

interface LayerControlPanelProps {
  layerVisibility: {
    heatmap: boolean;
    zones: boolean;
    arcs: boolean;
  };
  setLayerVisibility: (visibility: {
    heatmap: boolean;
    zones: boolean;
    arcs: boolean;
  }) => void;
}

export default function LayerControlPanel({
  layerVisibility,
  setLayerVisibility,
}: LayerControlPanelProps) {
  // Manejador para cambiar la visibilidad de cada capa
  const handleToggleLayer = (layer: keyof typeof layerVisibility) => {
    setLayerVisibility({
      ...layerVisibility,
      [layer]: !layerVisibility[layer],
    });
  };

  return (
    <div className="fixed top-4 right-4 bg-white/90 p-4 rounded-lg shadow-md z-50">
      <h3 className="text-lg font-bold mb-2">Layer Controls</h3>
      <div className="flex flex-col gap-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={layerVisibility.heatmap}
            onChange={() => handleToggleLayer("heatmap")}
            className="mr-2"
          />
          Heatmap
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={layerVisibility.zones}
            onChange={() => handleToggleLayer("zones")}
            className="mr-2"
          />
          Zones
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={layerVisibility.arcs}
            onChange={() => handleToggleLayer("arcs")}
            className="mr-2"
          />
          Arcs
        </label>
      </div>
    </div>
  );
}