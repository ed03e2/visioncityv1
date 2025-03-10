"use client";
import { useEffect, useMemo, useState } from "react";
import DeckGL from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { BitmapLayer, GeoJsonLayer, ArcLayer } from "@deck.gl/layers";
import Map from "react-map-gl";
import * as d3 from "d3"

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
  onMapClick: (lat: number, lng: number) => void; // ✅ Añadir esta línea
  markers: any[]; // ✅ Añadir esta línea
  setHeatmapData: (data: any[]) => void;
}) {
  const [data, setData] = useState([]);
  const [arcData, setArcData] = useState([]);
  const [bitmapImage, setBitmapImage] = useState<string | null>(null);
  const [zonesDurationData, setZonesDurationData] = useState<ZonesDurationData[]>([]);
  const [center, setCenter] = useState({ lat: 25.6518, lng: -100.287 });
  const [refresh, setRefresh] = useState(false);

  const canFetch = selectedDate && availableDates.includes(selectedDate);
  const [hoveredZone, setHoveredZone] = useState<{ duration: number; x: number; y: number } | null>(null);

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
      return [200, 200, 200, 150]; // Default Gray While Loading
    }
  
    const durations = zonesDurationData.map((zone) => zone.duration);
    if (durations.length < 3) {
      return [200, 200, 200, 150]; // If not enough data, default gray
    }
  
    // Compute quantiles for 3 ranges
    const q1 = d3.quantile(durations, 0.3); // Lower bound
    const q2 = d3.quantile(durations, 0.8); // Upper bound
  
    if (q1 === null || q2 === null) {
      return [200, 200, 200, 150]; // Safe fallback
    }
  
    const zoneData = zonesDurationData.find((zone) => zone.zone === zoneId);
    if (!zoneData) {
      console.warn(`⚠️ No duration data found for zone: ${zoneId}`);
      return [200, 200, 200, 150]; // Default Gray for Missing Zones
    }
  
    const duration = zoneData.duration;
  
    // Color mapping based on quantiles
    return duration <= q1
    ? [211, 211, 211, 200] // Light Gray (#D3D3D3) - Low Duration
    : duration <= q2
    ? [255, 128, 192, 200] // Light Magenta (#FF80C0) - Medium Duration
    : [128, 0, 64, 200]; // Dark Magenta (#800040) - High Duration
  
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
          highlightColor: [100, 150, 250, 100],
          getLineColor: [0, 0, 0, 255],
          getLineWidth: 0.1,
        
          // ✅ Click to Select or Deselect Zone
          onClick: (info) => {
            if (info.object) {
              setSelectedZone(info.object.properties.zone_id);
            } else {
              setSelectedZone(null); // ✅ Close graphs if clicking outside a zone
            }
          },
        
          // ✅ Hover for Tooltip
          onHover: (info) => {
            if (info.object) {
              const zoneId = info.object.properties.zone_id;
              const zoneData = zonesDurationData.find((zone) => zone.zone === zoneId);
        
              if (zoneData) {
                setHoveredZone({
                  duration: zoneData.duration,
                  x: info.x,
                  y: info.y,
                });
              }
            } else {
              setHoveredZone(null);
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

  // ✅ Function to Download Data as GeoJSON
  const downloadGeoJSON = () => {
    if (!zonesData || !zonesData.features) {
      console.error("❌ Error: zonesData is not in the correct format.");
      return;
    }
  
    const geoJsonData = {
      type: "FeatureCollection",
      features: [
        // ✅ Heatmap Data (Points)
        ...data.map((d) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [d.long, d.lat],
          },
          properties: {
            id: d.id,
            id_person: d.id_person,
            timestamp: d.timestamp,
            zone_id: d.zone_id,
          },
        })),
  
        // ✅ Arc Data (Origin & Destination Points)
        ...arcData.flatMap((d) => [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [d.origin_lon, d.origin_lat],
            },
            properties: {
              type: "origin",
              id: d.id,
              weight: d.weight,
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [d.destination_lon, d.destination_lat],
            },
            properties: {
              type: "destination",
              id: d.id,
              weight: d.weight,
            },
          },
        ]),
  
        // ✅ Zone Duration Data (Polygons)
        ...zonesDurationData.map((zone) => {
          const foundZone = Array.isArray(zonesData.features) 
            ? zonesData.features.find((z) => z.properties.zone_id === zone.zone) 
            : null;
  
          return {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: foundZone?.geometry?.coordinates || [],
            },
            properties: {
              zone: zone.zone,
              duration: zone.duration,
            },
          };
        }),
      ],
    };
  
    const jsonString = JSON.stringify(geoJsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "heatmap_data.geojson";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ✅ Compute KPI Values
  const totalUniquePersons = new Set(data.map((d) => d.id_person)).size;
  const meanDuration = zonesDurationData.length > 0
    ? (zonesDurationData.reduce((sum, zone) => sum + zone.duration, 0) / zonesDurationData.length).toFixed(1)
    : 0;
  const totalTransitions = arcData.reduce((sum, arc) => sum + (arc.weight || 0), 0); // ✅ Sum weights for total transitions

  return (
    <div className="relative w-full h-full">
      <DeckGL controller={DECK_GL_CONTROLLER} initialViewState={{ latitude: center.lat, longitude: center.lng, zoom: 15 }} layers={renderLayers}>
        <Map width="100%" height="100%" mapStyle="mapbox://styles/mapbox/satellite-v9" mapboxAccessToken="pk.eyJ1IjoibGFtZW91Y2hpIiwiYSI6ImNsa3ZqdHZtMDBjbTQzcXBpNzRyc2ljNGsifQ.287002jl7xT9SBub-dbBbQ"/>
      </DeckGL>
      {/* ✅ Tooltip */}
      {hoveredZone && (
        <div
          style={{
            position: "absolute",
            left: hoveredZone.x + 10,
            top: hoveredZone.y + 10,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            color: "#ffffff",
            padding: "6px 10px",
            borderRadius: "5px",
            fontSize: "14px",
            pointerEvents: "none",
            zIndex: 999,
          }}
        >
          {hoveredZone.duration < 60
            ? `${hoveredZone.duration.toFixed(1)} sec` // ✅ Ensures one decimal place
            : `${(hoveredZone.duration / 60).toFixed(1)} min`} {/* ✅ Converts to minutes with one decimal */}
        </div>
      )}
      {/* ✅ Download Button */}
      <button
        onClick={downloadGeoJSON}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
      >
        📥 Download GeoJSON
      </button>
      {/* ✅ KPI Dashboard */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 p-4 rounded-lg shadow-lg flex gap-6 text-white text-lg font-bold">
        <div className="flex flex-col items-center">
          👥 Unique Persons <span className="text-2xl">{totalUniquePersons}</span>
        </div>
        <div className="flex flex-col items-center">
          ⏳ Mean Duration <span className="text-2xl">{meanDuration} min</span>
        </div>
        <div className="flex flex-col items-center">
          🔄 Total Transitions <span className="text-2xl">{totalTransitions}</span>
        </div>
      </div>
    </div>
  );
  
}
