'use client';

import { useState, useEffect } from 'react';
import { BarChart } from '@/app/components/charts/BarChart';
import { LineChart } from '@/app/components/charts/LineChart';
import { PieChart } from '@/app/components/charts/PieChart';
import { Calendar } from '@/app/components/filters/Calendar';
import HeatMap from '@/app/components/charts/HeatMap';
import RangeSlider from '@/app/components/filters/RangeSlider'; // New component

const API_URL = "http://localhost:5000/available-dates"; // Flask API

export default function DashboardPage() {
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Always format as YYYY-MM-DD
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<[number, number]>([12, 16]); // ✅ Default 12:00 - 16:00

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.available_dates.length > 0) {
          const firstAvailableDate = data.available_dates.includes(getTodayDate())
            ? getTodayDate()
            : data.available_dates[0];

          setAvailableDates(data.available_dates);
          setSelectedDate(firstAvailableDate);
        }
      })
      .catch((err) => console.error("Error fetching available dates:", err));
  }, []);

  const handleDateChange = (date: string) => {
    if (availableDates.includes(date)) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Analytics</h2>
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex-1 min-w-[250px]"><BarChart /></div>
          <div className="flex-1 min-w-[250px]"><LineChart /></div>
          <div className="flex-1 min-w-[250px]"><PieChart /></div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Filter</h2>
          <Calendar selectedDate={selectedDate} onChange={handleDateChange} disabledDates={availableDates} />
          <RangeSlider value={timeRange} onChange={setTimeRange} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Map</h2>
          <HeatMap selectedDate={selectedDate} timeRange={timeRange} />
        </div>
      </div>
    </div>
  );
}
