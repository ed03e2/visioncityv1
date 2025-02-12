'use client';

import { useState, useEffect } from 'react';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { Calendar } from '@/components/charts/Calendar';
import HeatMap from '@/components/charts/HeatMap';

const API_URL = "http://localhost:5000/available-dates"; // Flask API

export default function DashboardPage() {
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Always format as YYYY-MM-DD
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Fetch available dates when the page loads
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>
          <BarChart />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Tendencias</h2>
          <LineChart />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Distribución</h2>
          <PieChart />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Calendario</h2>
          <Calendar 
            selectedDate={selectedDate} 
            onChange={handleDateChange}
            disabledDates={availableDates} 
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Mapa de Calor</h2>
          <HeatMap selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}
