'use client';

import { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { BitmapLayer } from '@deck.gl/layers';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';

const GOOGLE_MAPS_API_KEY = 'AIzaSyALw8hi8WHQy8AuqZXPD2lMkQai1ppnxyM'; // Replace with a valid key
const API_URL = "http://localhost:5000/heatmap"; // Flask backend
const BITMAP_API_URL = "http://localhost:5000/bitmap"; // Flask image API

type Observation = {
  id: string;
  id_person: string;
  lat: number;
  long: number;
  timestamp: string;
};

export default function HeatMap({ selectedDate, timeRange }: { selectedDate: string; timeRange: [number, number] }) {
  const [data, setData] = useState<Observation[]>([]);
  const [bitmapImage, setBitmapImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [center, setCenter] = useState({ lat: 25.6518, lng: -100.2870 });

  // 🔹 Fetch Heatmap Data
  useEffect(() => {
    if (!selectedDate) return;

    setLoading(true);
    setError(null);

    console.log(`Fetching heatmap data for date: ${selectedDate}, Time Range: ${timeRange[0]}-${timeRange[1]}`);

    fetch(`${API_URL}?date=${selectedDate}&startHour=${timeRange[0]}&endHour=${timeRange[1]}`)
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
  }, [selectedDate, timeRange]); // ✅ Update heatmap when date or hour changes

  // 🔹 Fetch Bitmap Image
  useEffect(() => {
    fetch(BITMAP_API_URL)
      .then((res) => res.json())
      .then((json) => {
        if (json.image) {
          setBitmapImage(json.image);
        }
      })
      .catch((err) => console.error("Error fetching bitmap image:", err));
  }, []);

  useEffect(() => {
    if (!data.length && !bitmapImage) return;

    const map = new google.maps.Map(document.getElementById("map-container") as HTMLElement, {
      center: center,
      zoom: 18,
      mapTypeId: 'satellite',
      disableDefaultUI: true,
    });

    const bitmapLayer = new BitmapLayer({
      id: 'bitmap-layer',
      bounds: [
        [-100.28813684548274, 25.650376387020653], // Bottom-left
        [-100.28813684548274, 25.654316647171434], // Top-left
        [-100.28389981756604, 25.654316647171434], // Top-right
        [-100.28389981756604, 25.650376387020653]  // Bottom-right
      ],
      image: bitmapImage, // Base64 Image
      opacity: 1,
    });
    const layers = [bitmapLayer];
    
    const heatmapLayer = new HeatmapLayer({
      id: 'heatmap-layer',
      data,
      getPosition: (d) => [d.long, d.lat],
      getWeight: (d) => 1,
      aggregation: 'SUM',
      radiusPixels: 40,
    });

    layers.push(heatmapLayer);



    const overlay = new GoogleMapsOverlay({ layers });
    overlay.setMap(map);
  }, [data, center, bitmapImage]); // ✅ Updates when data or image changes

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
      {loading && <p className="text-center">Loading heatmap...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      <div id="map-container" className="absolute inset-0" />
    </div>
  );
}
