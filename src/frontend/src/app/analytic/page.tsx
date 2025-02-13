'use client';
import { CgMathPlus } from "react-icons/cg";
import { FaMapMarkerAlt, FaBriefcase, FaWalking, FaChartLine, FaPlus, FaCog, FaShareAlt } from "react-icons/fa";
import { BarChart } from '@/app/components/charts/BarChart';
import { LineChart } from '@/app/components/charts/LineChart';
import Link from 'next/link';

export default function AnalyticsOverview() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-16 bg-gray-800 text-white flex flex-col items-center py-4">
        <button className="mb-4">
          <FaMapMarkerAlt />
        </button>
        <button className="mb-4">
          <FaBriefcase />
        </button>
        <button className="mb-4">
          <FaWalking />
        </button>
        <button className="mb-4">
          <FaChartLine />
        </button>
        <button className="mb-4">
          <FaPlus />
        </button>
        <button className="mb-4">
          <FaCog />
        </button>
        <button>
          <FaShareAlt />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Analytics Overview</h1>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/space" 
            >
              <CgMathPlus />
            </Link>
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src='https://assets.api.uizard.io/api/cdn/stream/5d4d7948-b4ae-4b74-9256-1520db603253.png'
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Pedestrian Count */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Pedestrian Count</h2>
            <button className="text-gray-600">⋮</button>
          </div>
          <h3 className="text-2xl font-bold mb-4">Total</h3>
          <button className="w-full py-2 bg-white text-gray-700 rounded border border-gray-200 hover:bg-gray-50 transition-colors">
            Add new section
          </button>
        </div>

          {/* Comfort Levels */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Comfort Levels</h2>
              <span className="text-xl">��</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">14</h3>
            <button className="w-full py-2 bg-white text-gray-700 rounded border border-gray-200 hover:bg-gray-50 transition-colors">
              Add comfort data
            </button>
          </div>

        {/* Trajectories Analysis */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Trajectories Analysis</h2>
            <select className="bg-white px-3 py-1 rounded text-sm border border-gray-200">
              <option>Section</option>
            </select>
          </div>
          <div className="mb-2">
            <span className="text-xl font-bold">37</span>
            <span className="text-sm text-gray-500 ml-2">paths</span>
            <span className="text-xs text-gray-400 block">Avg. 148 paths/month</span>
          </div>
          <div className="h-32 mt-4">
            {/* Aquí irá el gráfico de barras */}
            <div className="w-full h-full bg-white rounded"></div>
          </div>
        </div>
      </div>

      {/* Actividades de Usuario */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="font-bold mb-4">User Activities</h2>
        <div className="flex gap-4 text-sm text-gray-600 mb-4">
          <span>Morning trends</span>
          <span>Afternoon insights</span>
          <span>Evening patterns</span>
        </div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>

      {/* Categorías de Actividad */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Activity Categories</h2>
          <button className="text-blue-600 flex items-center">
            Explore more →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Data Analysis', 'Visual Insights', 'Operational', 'Visitor'].map((category) => (
            <div key={category} className="bg-black p-4 rounded-lg text-white">
              <div className="bg-white w-8 h-8 rounded mb-2"></div>
              <span>{category}</span>
            </div>
          ))}
        </div>
      </div>

        {/* Análisis de Niveles de Confort */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Comfort Levels Analysis</h2>
            <select className="bg-white px-2 py-1 rounded text-sm">
              <option>Dimension</option>
            </select>
          </div>
          <div className="mb-4">
            <span className="text-xl font-bold">+ $12,856.14</span>
            <span className="text-sm text-gray-500 ml-2">Avg. $3,000/month</span>
          </div>
          <div className="h-48">
            <LineChart />
          </div>
        </div>
      </div>
    </div>
  );
}