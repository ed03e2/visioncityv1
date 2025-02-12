import React, { useEffect } from "react";
import {
  ORTHO_BOUNDS,
  ORTHO_IMAGE,
  ORTHO_CENTER,} from "@/app/constanst";
import { ImageOverlay, MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";

type Point = { lat: number; lon: number; taken_at: number };

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  iconSize: [16, 16], // Smaller size for the icon
  iconAnchor: [8, 16], // Center the icon on the marker position
  popupAnchor: [0, -16], // Adjust the popup position
});

// HeatMap component that renders a heatmap of the people in the park at a given time.
export default function HeatMap(props: { startDate: string; endDate: string }) {
  const { startDate, endDate } = props;
  const [points, setPoints] = React.useState<Point[]>([]);
  const [areas, setAreas] = React.useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const start_ts =
        Date.parse(startDate.replace(/-/g, "/")) || 1680000000000;
      const end_ts = Date.parse(endDate.replace(/-/g, "/")) || 1684000000000;

      // Fetch the heatmap data from the backend
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/people?after=${start_ts}&before=${end_ts}`
      ).then((response) => response.json());
      const tooltipData: any[] = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/tooltip/?after=${start_ts}&before=${end_ts}`
      ).then((response) => response.json());

      setPoints(response.points as Point[]);
      setAreas(tooltipData);
    };
    fetchData();
  }, [startDate, endDate]);

  function getLabel(area: any) {
    const { reading, walking, playing, running } = area;
    const acts = [
      { label: "reading", value: reading },
      { label: "walking", value: walking },
      { label: "playing", value: playing },
      { label: "running", value: running },
    ].sort((a, b) => a.value - b.value).slice(2);
    return acts.map((a: any) => `${a.label}: ${Math.ceil(a.value)}`).join(", ");
  }

  return (
    <React.Fragment>
      <MapContainer
        className="Map"
        zoom={18}
        center={ORTHO_CENTER}
        doubleClickZoom={false}
        scrollWheelZoom={true}
        attributionControl={false}
        style={{ minHeight: "70vh", width: "100%" }}
        maxBounds={ORTHO_BOUNDS}
        minZoom={17}
      >
        <TileLayer
          attribution="Google Maps Satellite"
          url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
          maxZoom={24}
        />
        <ImageOverlay url={ORTHO_IMAGE} bounds={ORTHO_BOUNDS} />
        {areas.map((area: any, i: number) => (
          <Marker
            key={`marker-${i}`}
            position={{ lat: area.lat, lng: area.lon }}
            icon={markerIcon}
          >
            {/* Tooltip now only shows on hover */}
            <Tooltip direction="auto" offset={[0, 0]} opacity={1}>
              {getLabel(area)}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </React.Fragment>
  );
}
