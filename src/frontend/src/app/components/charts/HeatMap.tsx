'use client';

import { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { BitmapLayer, GeoJsonLayer, ArcLayer } from '@deck.gl/layers';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';

const GOOGLE_MAPS_API_KEY = "AIzaSyALw8hi8WHQy8AuqZXPD2lMkQai1ppnxyM"; // 🔹 Replace with your API key
const API_URL = "http://localhost:5000/heatmap";
const BITMAP_API_URL = "http://localhost:5000/bitmap";
const ARC_DATA_URL = "http://localhost:5000/arc-data";
const ZONES_DATA_URL = "http://localhost:5000/zones";

export default function HeatMap({ selectedDate, timeRange }: { selectedDate: string; timeRange: [number, number] }) {
  const [data, setData] = useState([]);
  const [bitmapImage, setBitmapImage] = useState<string | null>(null);
  const [arcData, setArcData] = useState([]);
  const [zonesData, setZonesData] = useState([]);
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [center, setCenter] = useState({ lat: 25.6518, lng: -100.2870 });

  // ✅ Ensure Google Maps is Initialized
  useEffect(() => {
    if (typeof window !== "undefined" && window.google && !googleMap) {
      console.log("✅ Initializing Google Maps...");
      setGoogleMap(
        new google.maps.Map(document.getElementById("map-container") as HTMLElement, {
          center,
          zoom: 15,
          mapTypeId: "satellite",
          disableDefaultUI: true,
        })
      );
    }
  }, [googleMap]);

  // ✅ Fetch Heatmap Data
  useEffect(() => {
    if (!selectedDate) return;

    setLoading(true);
    setError(null);

    fetch(`${API_URL}?date=${selectedDate}&startHour=${timeRange[0]}&endHour=${timeRange[1]}`)
      .then(res => res.json())
      .then(json => {
        if (!json || !json.features) throw new Error("Invalid response format from backend.");
        const processedData = json.features.map((d: any) => ({
          id: d.properties.id,
          id_person: d.properties.id_person,
          lat: parseFloat(d.geometry.coordinates[1]),
          long: parseFloat(d.geometry.coordinates[0]),
          timestamp: d.properties.timestamp
        }));

        setData(processedData);
        if (processedData.length > 0) {
          setCenter({ lat: processedData[0].lat, lng: processedData[0].long });
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedDate, timeRange]);

  // ✅ Fetch Bitmap Image
  useEffect(() => {
    fetch(BITMAP_API_URL)
      .then(res => res.json())
      .then(json => json.image && setBitmapImage(json.image))
      .catch(err => console.error("Error fetching bitmap image:", err));
  }, []);

  // ✅ Fetch Arc Data (Zone Transitions)
  useEffect(() => {
    fetch(ARC_DATA_URL)
      .then(res => res.json())
      .then(json => {
        if (!json || !json.arc_data) throw new Error("Invalid ArcLayer response.");
        setArcData(
          json.arc_data.map((d: any) => ({
            origin_lat: parseFloat(d.origin_lat),
            origin_lon: parseFloat(d.origin_lon),
            destination_lat: parseFloat(d.destination_lat),
            destination_lon: parseFloat(d.destination_lon),
            weight: parseFloat(d.weight),
          }))
        );
      })
      .catch(err => console.error("Error fetching arc data:", err));
  }, []);

  // ✅ Fetch Zone Polygons
  useEffect(() => {
    fetch(ZONES_DATA_URL)
      .then(res => res.json())
      .then(json => {
        if (!json || !json.zones) throw new Error("Invalid Zones response.");
        setZonesData(JSON.parse(json.zones));
      })
      .catch(err => console.error("Error fetching zones:", err));
  }, []);

  useEffect(() => {
    if (!googleMap) return;

    console.log("✅ Rendering Deck.GL Layers...");

    const overlay = new GoogleMapsOverlay({
      layers: [
        bitmapImage && new BitmapLayer({
          id: 'bitmap-layer',
          bounds: [
            [-100.28813684548274, 25.650376387020653],
            [-100.28813684548274, 25.654316647171434],
            [-100.28389981756604, 25.654316647171434],
            [-100.28389981756604, 25.650376387020653]
          ],
          image: bitmapImage,
          opacity: 1,
        }),

        new GeoJsonLayer({
          id: "zones-layer",
          data: zonesData,
          getFillColor: [100, 150, 250, 100],
          getLineColor: [0, 0, 0, 255],
          getLineWidth: 2,
          pickable: true,
        }),

        new HeatmapLayer({
          id: 'heatmap-layer',
          data,
          getPosition: (d) => [d.long, d.lat],
          getWeight: (d) => 1,
          aggregation: 'SUM',
          radiusPixels: 40,
        }),

        new ArcLayer({
          id: 'arc-layer',
          data: arcData,
          getSourcePosition: (d) => [d.origin_lon, d.origin_lat],
          getTargetPosition: (d) => [d.destination_lon, d.destination_lat],
          getWidth: (d) => Math.max(1, d.weight * 0.1),
          getSourceColor: [0, 0, 255],
          getTargetColor: [255, 0, 0],
          pickable: true,
        }),
      ].filter(Boolean)
    });

    overlay.setMap(googleMap);
  }, [googleMap, data, bitmapImage, zonesData, arcData]);

  return (
    <div className="relative w-full">
      <div className="h-[500px] w-full rounded-lg overflow-hidden border border-gray-300 relative">
        <div id="map-container" className="h-full w-full" />
      </div>
    </div>
  );
}
