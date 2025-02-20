"use client";

import { useEffect, useMemo, useState } from "react";
import DeckGL from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { BitmapLayer, GeoJsonLayer, ArcLayer } from "@deck.gl/layers";
import Map from "react-map-gl";

const API_URLS = {
  HEATMAP: "http://localhost:5000/heatmap",
  ARC_AND_DURATION: "http://localhost:5000/arc-and-duration",
  BITMAP: "http://localhost:5000/bitmap",
};

export const DECK_GL_CONTROLLER = {
  touchZoom: true,
  keyboard: { moveSpeed: false },
  dragMode: "pan",
};

interface ZonesDurationData {
  zone: string;
  duration: number;
}


export default function HeatMap({
  selectedDate,
  timeRange,
  availableDates,
  zonesData,
  setSelectedZone,
  setHeatmapData,
}: {
  selectedDate: string;
  timeRange: [number, number];
  availableDates: string[];
  zonesData: any[];
  setSelectedZone: (zoneId: string | null) => void;
  setHeatmapData: (data: any[]) => void;
}) {
  const [data, setData] = useState([]);
  const [arcData, setArcData] = useState([]);
  const [bitmapImage, setBitmapImage] = useState<string | null>(null);
  const [zonesDurationData, setZonesDurationData] = useState<ZonesDurationData[]>([]);
  const [center, setCenter] = useState({ lat: 25.6518, lng: -100.287 });
  const [refresh, setRefresh] = useState(false);

  const canFetch = selectedDate && availableDates.includes(selectedDate);

  // ✅ Fetch Bitmap Image FIRST (Static Data)
  useEffect(() => {
    fetch(API_URLS.BITMAP)
      .then((res) => res.json())
      .then((json) => {
        if (json?.image) setBitmapImage(json.image);
      })
      .catch((err) => console.error("Error fetching bitmap image:", err));
  }, []);

  // ✅ Debounced Fetch Effect (Prevents Multiple Requests When Adjusting the Time Slider)
  useEffect(() => {
    if (!canFetch) return;

    const timeoutId = setTimeout(() => {
      fetch(`${API_URLS.HEATMAP}?date=${selectedDate}&startHour=${timeRange[0]}&endHour=${timeRange[1]}`)
        .then((res) => res.json())
        .then((json) => {
          if (!json?.features) return;
          const processedData = json.features.map((d: any) => ({
            id: d.properties.id,
            id_person: d.properties.id_person,
            lat: parseFloat(d.geometry.coordinates[1]),
            long: parseFloat(d.geometry.coordinates[0]),
            timestamp: d.properties.timestamp,
            zone_id: d.properties.zone_id || null, // ✅ Include zone_id
          }));
          setData(processedData);
          setHeatmapData(processedData); // ✅ Send updated heatmap data to DashboardPage
          if (processedData.length > 0) {
            setCenter({ lat: processedData[0].lat, lng: processedData[0].long });
          }
        });
    }, 500); // ✅ Delay of 500ms before making a request

    return () => clearTimeout(timeoutId); // ✅ Clears timeout if the user keeps adjusting
  }, [canFetch, selectedDate, timeRange]);

  // ✅ Fetch Arc Data & Duration Data (Debounced)
  useEffect(() => {
    if (!canFetch) return;

    const timeoutId = setTimeout(() => {
      fetch(`${API_URLS.ARC_AND_DURATION}?date=${selectedDate}&startHour=${timeRange[0]}&endHour=${timeRange[1]}`)
        .then((res) => res.json())
        .then((json) => {
          if (json?.arc_data) setArcData(json.arc_data);
          if (json?.duration_data) {
            setZonesDurationData(json.duration_data);
            setRefresh((prev) => !prev);
          }
        })
        .catch((err) => console.error("Error fetching arc & duration data:", err));
    }, 500); // ✅ Debounce time

    return () => clearTimeout(timeoutId); // ✅ Clears timeout if still adjusting
  }, [canFetch, selectedDate, timeRange]);

  // ✅ Function to Get Fill Color Based on Duration
  const getZoneFillColor = (zoneId: string) => {
    if (!zonesDurationData.length) {
      return [200, 200, 200, 150]; // ✅ Default Gray While Loading
    }

    const zoneData = zonesDurationData.find((zone) => zone.zone === zoneId);
    if (!zoneData) {
      console.warn(`⚠️ No duration data found for zone: ${zoneId}`);
      return [200, 200, 200, 150]; // ✅ Default Gray for Missing Zones
    }

    const duration = zoneData.duration;
    return duration < 3
      ? [100, 150, 250, 200] // Light Blue
      : duration < 5
      ? [153, 255, 102, 200] // Green
      : duration < 8
      ? [255, 204, 102, 200] // Yellow
      : duration < 10
      ? [255, 153, 0, 200] // Orange
      : [255, 0, 0, 200]; // Red
  };

  // ✅ Layers Configuration (Includes Bitmap, Heatmap, Arc & Zones)
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

      new GeoJsonLayer({
        id: "zones-layer",
        data: zonesData,
        getFillColor: (d) => getZoneFillColor(d.properties.zone_id),
        updateTriggers: {
          getFillColor: [zonesDurationData],
        },
        pickable: true,
        autoHighlight: true,
        highlightColor: [100, 150, 250, 255], 
        getLineColor: [0, 0, 0, 255],
        getLineWidth: 1,
        onHover: (info) => {
          if (info.object) {
            setSelectedZone(info.object.properties.zone_id);
          } else {
            setSelectedZone(null);
          }
        },
      }),

      new HeatmapLayer({
        id: "heatmap-layer",
        data,
        getPosition: (d) => [d.long, d.lat],
        getWeight: (d) => 1,
        aggregation: "SUM",
        radiusPixels: 40,
      }),

      new ArcLayer({
        id: "arc-layer",
        data: arcData,
        getSourcePosition: (d) => [d.origin_lon, d.origin_lat],
        getTargetPosition: (d) => [d.destination_lon, d.destination_lat],
        getWidth: (d) =>  d.weight ,
        getSourceColor: [0, 0, 255],
        getTargetColor: [255, 0, 0],
        pickable: true,
      }),
    ].filter(Boolean);
  }, [bitmapImage, arcData, data, zonesData, zonesDurationData, refresh]);

  return (
    <DeckGL controller={DECK_GL_CONTROLLER} initialViewState={{ latitude: center.lat, longitude: center.lng, zoom: 15 }} layers={renderLayers}>
      <Map width="100%" height="100%" mapStyle="mapbox://styles/mapbox/satellite-v9" mapboxAccessToken="pk.eyJ1IjoibGFtZW91Y2hpIiwiYSI6ImNsa3ZqdHZtMDBjbTQzcXBpNzRyc2ljNGsifQ.287002jl7xT9SBub-dbBbQ"/>
    </DeckGL>
  );
}
