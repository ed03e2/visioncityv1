'use client';
import React from "react";
import { useState } from 'react';
import { BarChart } from '@/app/components/charts/BarChart';
import { LineChart } from '@/app/components/charts/LineChart';
import { PieChart } from '@/app/components/charts/PieChart';
import { Calendar } from '@/app/components/charts/Calendar';
import HeatMap from '@/app/components/charts/HeatMap'
import moment from 'moment'

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const tomorrow = moment().add(2, 'days');
  const [startDate, setStartDate] = React.useState("2023-05-01");
  const [endDate, setEndDate] = React.useState(tomorrow.format('YYYY-MM-DD'));
  

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gráfico de Barras */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>
          <BarChart />
        </div>

        {/* Gráfico de Líneas */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Tendencias</h2>
          <LineChart />
        </div>

        {/* Gráfico Circular */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Distribución</h2>
          <PieChart />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Calendario */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Calendario</h2>
          <Calendar 
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </div>

        {/* Mapa de Calor */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Mapa de Calor</h2>
        </div>
      </div>
    </div>
  );
}
