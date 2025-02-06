'use client';

import { useState } from 'react';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { Calendar } from '@/components/charts/Calendar';
import { HeatMap } from '@/components/charts/HeatMap';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

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
          <HeatMap/>
        </div>
      </div>
    </div>
  );
}
