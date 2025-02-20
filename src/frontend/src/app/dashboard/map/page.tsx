'use client'
import { useState, useEffect } from 'react';
import HeatMap from '@/app/components/charts/HeatMap';
import Sidebar from '@/app/components/layout/Sidebar';
import AnalyticsModal from '@/app/components/charts/AnalyticsModal';


export default function Map (){
  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<[number, number]>([12, 16]);
  const [zonesData, setZonesData] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null); // Zone ID for analytics

  return (
    <div className="relative w-screen h-screen">
      <HeatMap 
      selectedDate={selectedDate} 
      timeRange={timeRange} 
      availableDates={availableDates} 
      zonesData={zonesData} 
      setSelectedZone={setSelectedZone}
      />
    </div>
  )
}