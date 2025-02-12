'use client';

import { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';

const GOOGLE_MAPS_API_KEY = 'AIzaSyALw8hi8WHQy8AuqZXPD2lMkQai1ppnxyM';
const API_URL = "http://localhost:5000/heatmap"; // Flask backend

type Observation = {
  id: string;
  id_person: string;
  lat: number;
  long: number;
  timestamp: string;
};

export default function HeatMap({ selectedDate }: { selectedDate: string }) {
  const [data, setData] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [center, setCenter] = useState({ lat: 25.6518, lng: -100.2870 });

  useEffect(() => {
    if (!selectedDate) return;

    setLoading(true);
    setError(null);

    console.log(`Fetching heatmap data for date: ${selectedDate}`); // ✅ Debug log

    fetch(`${API_URL}?date=${selectedDate}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!json || !json.features) {
          throw new Error("Invalid response format from backend.");
        }

        const processedData = json.features.map((d: any) => ({
          id: d.properties.id,
          id_person: d.properties.id_person,
          lat: d.geometry.coordinates[1], // lat
          long: d.geometry.coordinates[0], // long
          timestamp: d.properties.timestamp
        }));

        setData(processedData);

        if (processedData.length > 0) {
          setCenter({ lat: processedData[0].lat, lng: processedData[0].long });
        }
      })
      .catch((err) => {
        console.error("Error fetching heatmap data:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedDate]); // ✅ Heatmap updates when selectedDate changes

  useEffect(() => {
    if (!data.length) return;

    const map = new google.maps.Map(document.getElementById("map-container") as HTMLElement, {
      center: center,
      zoom: 18,
      mapTypeId: 'satellite',
      disableDefaultUI: true,
    });

    const heatmapLayer = new HeatmapLayer({
      id: 'heatmap-layer',
      data,
      getPosition: (d) => [d.long, d.lat],
      getWeight: (d) => 1,
      aggregation: 'SUM',
      radiusPixels: 40,
    });

    const overlay = new GoogleMapsOverlay({ layers: [heatmapLayer] });
    overlay.setMap(map);
  }, [data, center]); // ✅ Map updates when data changes

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
      {loading && <p className="text-center">Loading heatmap...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      <div id="map-container" className="absolute inset-0" />
    </div>
  );
}
