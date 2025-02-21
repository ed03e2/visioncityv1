"use client"
import HeatMap from "@/app/components/charts/HeatMap"
import {LatLngTuple, Map,icon } from "leaflet";
import {ImageOverlay, LayerGroup, LayersControl, MapContainer, Marker, TileLayer,} from "react-leaflet";
import { useState } from "react"

export default function map(){
    const getTodayDate = () => new Date().toISOString().split("T")[0];
  
    const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [timeRange, setTimeRange] = useState<[number, number]>([12, 16]);
    const [zonesData, setZonesData] = useState<any[]>([]);
    const [selectedZone, setSelectedZone] = useState<string | null>(null); // Zone ID for analytics
    const [heatmapData, setHeatmapData] = useState<any[]>([]); // ✅ Store heatmap data
    const [markers, setMarkers] = useState<LatLngTuple[]>([]);
    const [orthoMarkers, setOrthoMarkers] = useState<LatLngTuple[]>([]);
    const [sampleMarker, setSampleMarker] = useState<LatLngTuple>([0, 0]);
    const [estimatedMarker, setEstimatedMarker] = useState<LatLngTuple>([0, 0]);
  
  return (
    <div className="relative w-screen h-screen">
      <HeatMap
        selectedDate={selectedDate}
        timeRange={timeRange}
        availableDates={availableDates}
        zonesData={zonesData}
        setSelectedZone={setSelectedZone}
        setHeatmapData={setHeatmapData} onMapClick={function (lat: number, lng: number): void {
          throw new Error("Function not implemented.");
        } } markers={[]}/>
    </div>
  )
}