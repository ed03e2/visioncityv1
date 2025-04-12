// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import HeatMap from '@/app/components/charts/HeatMap';
// import Sidebar from '@/app/components/layout/Sidebar'; 
// import AnalyticsModal from '@/app/components/charts/AnalyticsModal';

// const API_URLS = {
//   AVAILABLE_DATES: "http://localhost:5000/available-dates",
//   ZONES: "http://localhost:5000/zones",
// };

// export default function DashboardPage() {
//   const getTodayDate = () => new Date().toISOString().split("T")[0];

//   const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
//   const [availableDates, setAvailableDates] = useState<string[]>([]);
//   const [timeRange, setTimeRange] = useState<[number, number]>([12, 16]);
//   const [zonesData, setZonesData] = useState<any[]>([]);
//   const [selectedZone, setSelectedZone] = useState<string | null>(null);
//   const [heatmapData, setHeatmapData] = useState<any[]>([]);
//   const modalRef = useRef<HTMLDivElement | null>(null);

//   // ✅ Close modal when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         setSelectedZone(null); // ✅ Close modal
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // ✅ Fetch Available Dates
//   useEffect(() => {
//     fetch("http://localhost:5000/available-dates")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.available_dates?.length > 0) {
//           const firstAvailable = data.available_dates.includes(getTodayDate())
//             ? getTodayDate()
//             : data.available_dates[0];

//           setAvailableDates(data.available_dates);
//           setSelectedDate(firstAvailable);
//         }
//       })
//       .catch((err) => console.error("Error fetching available dates:", err));
//   }, []);

//   // ✅ Fetch Zone Polygons
//   useEffect(() => {
//     fetch("http://localhost:5000/zones")
//       .then((res) => res.json())
//       .then((json) => {
//         if (!json?.zones) return console.warn("⚠️ No zones data found.");
//         setZonesData(JSON.parse(json.zones));
//       })
//       .catch((err) => console.error("Error fetching zones:", err));
//   }, []);

//   return (
//     <div className="relative w-screen h-screen">
//       {/* Sidebar */}
//       <Sidebar
//         selectedDate={selectedDate}
//         setSelectedDate={setSelectedDate}
//         availableDates={availableDates}
//         timeRange={timeRange}
//         setTimeRange={setTimeRange}
//       />

//       {/* Heatmap */}
//       <HeatMap
//         selectedDate={selectedDate}
//         timeRange={timeRange}
//         availableDates={availableDates}
//         zonesData={zonesData}
//         setSelectedZone={setSelectedZone}
//         setHeatmapData={setHeatmapData}
//       />

//       {/* Analytics Modal */}
//       {selectedZone && (
//         <div ref={modalRef}>
//           <AnalyticsModal zoneId={selectedZone} heatmapData={heatmapData} />
//         </div>
//       )}
//     </div>
//   );
// }














// page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Se ha añadido la propiedad 'camsFov' al objeto de control de capas
  const [layerVisibility, setLayerVisibility] = useState({
    heatmap: true,
    zones: true,
    arcs: true,
    camsFov: true,  // NUEVO: Control de la capa FOV
    scatter: true,
    density: false,
  });

  // Cerrar modal al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedZone(null); // Cierra modal
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch de Fechas Disponibles
  useEffect(() => {
    fetch("http://localhost:5000/available-dates")
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

  // Fetch de Polígonos de Zonas
  useEffect(() => {
    fetch("http://localhost:5000/zones")
      .then((res) => res.json())
      .then((json) => {
        if (!json?.zones) return console.warn("⚠️ No zones data found.");
        setZonesData(JSON.parse(json.zones));
      })
      .catch((err) => console.error("Error fetching zones:", err));
  }, []);

  return (
    <div className="relative w-screen h-screen">
      {/* Sidebar con controles de visibilidad de capas */}
      <Sidebar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        availableDates={availableDates}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        layerVisibility={layerVisibility}
        setLayerVisibility={setLayerVisibility}
      />

      {/* Heatmap */}
      <HeatMap
        selectedDate={selectedDate}
        timeRange={timeRange}
        availableDates={availableDates}
        zonesData={zonesData}
        setSelectedZone={setSelectedZone}
        setHeatmapData={setHeatmapData}
        layerVisibility={layerVisibility}
      />

      {/* Analytics Modal */}
      {selectedZone && (
        <div ref={modalRef}>
          <AnalyticsModal zoneId={selectedZone} heatmapData={heatmapData} />
        </div>
      )}
    </div>
  );
}







// // page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import HeatMap from '@/app/components/charts/HeatMap';
// import Sidebar from '@/app/components/layout/Sidebar';
// import AnalyticsModal from '@/app/components/charts/AnalyticsModal';

// const API_URLS = {
//   AVAILABLE_DATES: "http://localhost:5000/available-dates",
//   ZONES: "http://localhost:5000/zones",
// };

// export default function DashboardPage() {
//   const getTodayDate = () => new Date().toISOString().split("T")[0];

//   const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
//   const [availableDates, setAvailableDates] = useState<string[]>([]);
//   const [timeRange, setTimeRange] = useState<[number, number]>([12, 16]);
//   const [zonesData, setZonesData] = useState<any[]>([]);
//   const [selectedZone, setSelectedZone] = useState<string | null>(null);
//   const [heatmapData, setHeatmapData] = useState<any[]>([]);
//   const modalRef = useRef<HTMLDivElement | null>(null);
//   const [timeHeatmapOpen, setTimeHeatmapOpen] = useState(false);

//   // Capa de control de visibilidad de layers
//   const [layerVisibility, setLayerVisibility] = useState({
//     heatmap: true,
//     zones: true,
//     arcs: true,
//     camsFov: true,  // NUEVO: Control de la capa FOV
//     scatter: true,
//     density: false,
//   });

//   // Cerrar modal al hacer click fuera
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         setSelectedZone(null); // Cierra modal
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Fetch de Fechas Disponibles
//   useEffect(() => {
//     fetch("http://localhost:5000/available-dates")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.available_dates?.length > 0) {
//           const firstAvailable = data.available_dates.includes(getTodayDate())
//             ? getTodayDate()
//             : data.available_dates[0];

//           setAvailableDates(data.available_dates);
//           setSelectedDate(firstAvailable);
//         }
//       })
//       .catch((err) => console.error("Error fetching available dates:", err));
//   }, []);

//   // Fetch de Polígonos de Zonas
//   useEffect(() => {
//     fetch("http://localhost:5000/zones")
//       .then((res) => res.json())
//       .then((json) => {
//         if (!json?.zones) return console.warn("⚠️ No zones data found.");
//         setZonesData(JSON.parse(json.zones));
//       })
//       .catch((err) => console.error("Error fetching zones:", err));
//   }, []);

//   return (
//     <div className="relative w-screen h-screen">
//       {/* Sidebar con controles de visibilidad de capas */}
//       <Sidebar
//         selectedDate={selectedDate}
//         setSelectedDate={setSelectedDate}
//         availableDates={availableDates}
//         timeRange={timeRange}
//         setTimeRange={setTimeRange}
//         layerVisibility={layerVisibility}
//         setLayerVisibility={setLayerVisibility}
//       />

//       {/* Heatmap */}
//       <HeatMap
//         selectedDate={selectedDate}
//         timeRange={timeRange}
//         availableDates={availableDates}
//         zonesData={zonesData}
//         setSelectedZone={setSelectedZone}
//         setHeatmapData={setHeatmapData}
//         layerVisibility={layerVisibility}
//       />

//       {/* Analytics Modal */}
//       {selectedZone && (
//         <div ref={modalRef}>
//           <AnalyticsModal zoneId={selectedZone} heatmapData={heatmapData} />
//         </div>
//       )}

//       {/* Nuevo botón para visualizar el heatmap temporal */}
//       <button
//         onClick={() => setTimeHeatmapOpen(true)}
//         className="fixed bottom-16 right-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-full shadow-md transition-all duration-200"
//       >
//         📊 Heatmap Temporal
//       </button>

//       {/* Modal para el heatmap temporal */}
//       {timeHeatmapOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
//           onClick={() => setTimeHeatmapOpen(false)} // Cierra el modal al hacer click en el backdrop
//         >
//           <div
//             className="bg-white rounded-lg overflow-auto max-w-4xl max-h-full relative"
//             onClick={(e) => e.stopPropagation()} // Evita cerrar el modal al hacer click dentro
//           >
//             {/* Botón para cerrar el modal */}
//             <button
//               onClick={() => setTimeHeatmapOpen(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               &#x2716;
//             </button>
//             {/* Incrustar la visualización del heatmap temporal mediante un iframe */}
//             <iframe
//               title="Heatmap Temporal"
//               src="http://localhost:5000/analytics-time-heatmap"
//               width="100%"
//               height="600px"
//               frameBorder="0"
//             ></iframe>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
