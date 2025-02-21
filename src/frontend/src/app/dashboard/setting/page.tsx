'use client';

import { useState, useEffect } from 'react';
import HeatMap from '@/app/components/charts/HeatMap';
import Sidebar from '@/app/components/layout/Sidebar';
import AnalyticsModal from '@/app/components/charts/AnalyticsModal';

const API_URLS = {
  AVAILABLE_DATES: "http://localhost:5000/available-dates",
  ZONES: "http://localhost:5000/zones",
};

export default function DashboardPage() {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<[number, number]>([12, 16]);
  const [zonesData, setZonesData] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null); // Zone ID for analytics
  const [heatmapData, setHeatmapData] = useState<any[]>([]); // ✅ Store heatmap data

  // ✅ Fetch Available Dates First
  useEffect(() => {
    fetch(API_URLS.AVAILABLE_DATES)
      .then((res) => res.json())
      .then((data) => {
        if (data.available_dates?.length > 0) {
          const firstAvailable = data.available_dates.includes(getTodayDate())
            ? getTodayDate()
            : data.available_dates[0];

          setAvailableDates(data.available_dates);
          setSelectedDate(firstAvailable);
        }
      })
      .catch((err) => console.error("Error fetching available dates:", err));
  }, []);

  // ✅ Fetch Zone Polygons (Static Data)
  useEffect(() => {
    fetch(API_URLS.ZONES)
      .then((res) => res.json())
      .then((json) => {
        if (!json?.zones) return console.warn("⚠️ No zones data found.");
        setZonesData(JSON.parse(json.zones));
      })
      .catch((err) => console.error("Error fetching zones:", err));
  }, []);

  return (
    <div className="relative w-screen h-screen">
      {/* Sidebar with Filters */}
      <Sidebar 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
        availableDates={availableDates} 
        timeRange={timeRange} 
        setTimeRange={setTimeRange} 
      />

      {/* Full-screen Map */}
      <HeatMap 
        selectedDate={selectedDate}
        timeRange={timeRange}
        availableDates={availableDates}
        zonesData={zonesData}
        setSelectedZone={setSelectedZone}
        setHeatmapData={setHeatmapData} onMapClick={function (lat: number, lng: number): void {
          throw new Error('Function not implemented.');
        } } markers={[]}      />

      {/* Analytics Modal (Shows on Hover) */}
      {selectedZone && <AnalyticsModal zoneId={selectedZone} heatmapData={heatmapData}/>}
    </div>
  );
}
